db.getCollection("users").find({}, {_id: '$_id', nama: '$nama', email: '$email', role: '$role', __v: '$__v'})
