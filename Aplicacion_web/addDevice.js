let devicesJson = [{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.550975, 10.449198]
    },
  "properties": {
    "type_device": "river",
    "location": "Tempisque",
    "point_id": 1,
    "parameter": "waterLevel"
     }
}]

const r = require('rethinkdb');                             //Servicio base datosconst jsonFile = fs.readFileSync("imn_output.json")
r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'}).then(conn => {
  console.log("rethinkdb connected");

  r.table('disaster_monitors').insert(devicesJson).run(conn, function(err, result) { console.log("error>", err, result)}); 
  }
);

