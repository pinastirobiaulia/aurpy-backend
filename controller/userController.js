const emailValidator = require("email-validator");
const User = require("../models/users");
const Token = require("../models/token");
const sendEmail = require("../utils/helper");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../validate/hashNComparePwd");
const crypto = require("crypto");

const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find( 
      {},
      { _id: "$_id", nama: "$nama", email: "$email", password: "$password", role: "$role" }
    );
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    if (!req.query.nama) {
      return res.status(400).json({ message: "Wrong Query", status: 400 });
    }
    const result = await User.find(
      {
        nama: { $regex: req.query.nama, $options: "i" },
      },
      { _id: "$_id", nama: "$nama", email: "$email", password: "$password", role: "$role" }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.params.id },
      { _id: "$_id", nama: "$nama", email: "$email", password: "$password", role: "$role" }
    );
    // console.log(req.params);
    res.status(200).json({
      user,
      message: "user ditemukan",
    });
  } catch (err) {
    res.status(404).json({
      message: "id not found",
    });
  }
};

const addUser = async (req, res) => {
  const user = new User({
    nama: req.body.nama,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    role: 3,
  });
  try {
    const duplikat = await User.findOne({ email: user.email });
    if (duplikat) {
      throw new Error("email sudah digunakan");
    }
    if (emailValidator.validate(user.email) === false) {
      throw new Error("email not valid");
    }
    const addUser = await user.save();
    res.status(201).json({ addUser, message: "Registrasi Berhasil" });
  } catch (err) {
    res.status(400).json({ message: err.message, status: 400 });
  }
};

const deleteUser = async (req, res) => {
  try {
    const cekUser = await User.findOne({ _id: req.params.id });
    if (cekUser) {
      User.deleteOne(cekUser).then((result) => {
        res
          .status(200)
          .json({ result, message: "Data User Berhasil Di hapus" });
      });
    } else {
      res.status(400).json({ message: "id not found", status: 400 });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const reqError = (req, res) => {
  res.status(404).json({ status: 404, message: "Cannot request with this endpoint" });
};

const ubahRoleUser = async (req, res) => {
  try {
    const cekUser = await User.findOne({ _id: req.params.id });
    // console.log(cekUser);
    if (!cekUser) {
      throw new Error("id not found");
    }
    if (req.body.role > 3 || req.body.role < 1) {
      throw new Error("User role not allowed");
    }
    const roleUpdated = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          role: req.body.role,
        },
      }
    );
    res.status(200).json(roleUpdated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const cekUser = await User.findOne({ email: req.body.email });
    if (!cekUser) {
      throw new Error("email atau password salah!");
    } else if (cekUser) {
      const matchPass = await comparePassword(
        req.body.password,
        cekUser.password
      );
      if (!matchPass) {
        throw new Error("email atau password salah!");
      }
      if (matchPass) {
        const dataUser = {
          nama: cekUser.nama,
          email: cekUser.email,
          role: cekUser.role,
        };

        const token = jwt.sign(dataUser, "secret", { expiresIn: "2h" });
        res.status(200).json({ dataUser, token, message: "login berhasil" });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//tambahan
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ status: 400, message: "Pengguna dengan email tersebut tidak ditemukan" });

    let token = await Token.findOne({ userId: user._id });
    const resetCode = generateResetCode();
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: jwt.sign({ id: user._id }, "secretkey", { expiresIn: "45m" }),
        resetCode,
      }).save();
    } else {
      token.resetCode = resetCode;
      await token.save();
    }

    const html = `<p>Kode reset kata sandi Anda adalah: <b>${resetCode}</b></p>`;
    await sendEmail(user.email, "Kode Reset Kata Sandi", html);
    res.status(200).json({ message: "Kode reset dikirim ke email Anda" });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Terjadi kesalahan" });
  }
};

//cb baru
const verifyResetCode = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      throw new Error("Invalid user");
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      throw new Error("Invalid or expired reset code");
    }

    jwt.verify(token.token, "secretkey", async (err, decoded) => {
      if (err) {
        await token.delete();
        throw new Error("Invalid or expired reset code");
      }

      // Verifikasi berhasil, lakukan proses sesuai kebutuhan, misalnya mereset password

      // Contoh: Menghapus token setelah berhasil digunakan
      await token.delete();

      res.status(200).json({ message: "Reset code verified successfully" });
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};


// Perbarui fungsi resetPassword untuk menggunakan kode reset yang sudah diverifikasi
// Verify Reset Code and Reset Password
const resetPassword = async (req, res) => {
  try {
    const { userId, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ status: 400, message: "Kata sandi tidak cocok" });
    if (password.length < 8) return res.status(400).json({ status: 400, message: "Kata sandi harus minimal 8 karakter" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ status: 400, message: "Pengguna tidak ditemukan" });

    user.password = await hashPassword(password);
    user.resetCode = null; // Hapus reset code setelah password direset
    await user.save();

    res.status(200).json({ message: "Kata sandi berhasil diubah" });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Terjadi kesalahan" });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  reqError,
  login,
  ubahRoleUser,
  getUserById,
  searchUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
