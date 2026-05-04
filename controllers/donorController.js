const db = require('../db');

// REGISTER / UPDATE
exports.registerDonor = (req, res) => {

  let {
    name,
    phone,
    blood_group,
    latitude,
    longitude,
    age,
    gender,
    last_donation,
    weight,
    health,
    disease,
    availability,
    emergency
  } = req.body;

  if (!name || !phone || !blood_group) {
    return res.json({ message: "Required fields missing ❌" });
  }

  latitude = latitude || 17.3850;
  longitude = longitude || 78.4867;

  availability = availability == 1 ? 1 : 0;
  emergency = emergency == 1 ? 1 : 0;

  // CHECK EXISTING
  db.query("SELECT * FROM donors WHERE phone = ?", [phone], (err, result) => {

    if (result.length > 0) {

      db.query(`
        UPDATE donors SET 
          name=?, blood_group=?, latitude=?, longitude=?, availability=?,
          age=?, gender=?, last_donation=?, weight=?, health=?, disease=?, emergency=?
        WHERE phone=?
      `, [
        name, blood_group, latitude, longitude, availability,
        age || null, gender || null, last_donation || null,
        weight || null, health || 'Healthy', disease || 'No',
        emergency, phone
      ]);

      return res.json({ message: "Updated ✅" });

    } else {

      db.query(`
        INSERT INTO donors 
        (name, blood_group, phone, latitude, longitude, availability, age, gender, last_donation, weight, health, disease, emergency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, blood_group, phone, latitude, longitude, availability,
        age || null, gender || null, last_donation || null,
        weight || null, health || 'Healthy', disease || 'No', emergency
      ]);

      return res.json({ message: "Registered ✅" });
    }
  });
};


// 🩸 MARK DONATED
exports.markDonated = (req, res) => {

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID missing ❌" });
  }

  db.query(`
    UPDATE donors 
    SET last_donation = NOW(), availability = 0
    WHERE id = ?
  `, [id], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error ❌" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Donor not found ❌" });
    }

    res.json({ message: "Updated ✅" });
  });
};