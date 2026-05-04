const db = require('../db');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

exports.searchDonors = (req, res) => {

  let { blood_group, lat, lng, radius } = req.body;

  lat = parseFloat(lat);
  lng = parseFloat(lng);
  radius = parseFloat(radius) || 10;

  db.query("SELECT * FROM donors WHERE blood_group=?", [blood_group], (err, results) => {

    if (err) return res.json([]);

    let filtered = [];

    results.forEach(d => {

      // ❌ skip unavailable
      if (d.availability !== 1) return;

      // ❌ skip if donated < 90 days
      if (d.last_donation) {
        const diff = (new Date() - new Date(d.last_donation)) / (1000*60*60*24);
        if (diff < 90) return;
      }

      let dist = getDistance(lat, lng, d.latitude, d.longitude);

      if (dist <= radius) {
        d.distance = dist;
        filtered.push(d);
      }
    });

    res.json(filtered);
  });
};