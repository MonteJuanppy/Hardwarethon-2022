let devicesJson = [{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.550975, 10.449198]
    },
  "properties": {
    "type_device": "sensor",
    "location": "Filadelfia",
    "point_id": 1,
    "parameter": "waterLevel",
    "hot_point": "Rio Tempisque",
    "url": "/tempisque"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.496155, 10.387701]
    },
  "properties": {
    "type_device": "alarm",
    "location": "Los Corralillos",
    "point_id": 1,
    "parameter": "sound",
    "hot_point": "Rio Tempisque",
    "url": "/tempisque"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.489834, 10.42168]
    },
  "properties": {
    "type_device": "alarm",
    "location": "La Guinea",
    "point_id": 2,
    "parameter": "sound",
    "hot_point": "Rio Tempisque",
    "url": "/tempisque"
    }
  },
];

const r = require('rethinkdb');                             //Servicio base datosconst jsonFile = fs.readFileSync("imn_output.json")
r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'}).then(conn => {
  console.log("rethinkdb connected");

  r.table('disaster_monitors').insert(devicesJson).run(conn, function(err, result) { console.log("error>", err, result)}); 
  }
);

