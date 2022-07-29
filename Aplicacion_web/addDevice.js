let devicesJson = [
  {
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
    "point_id": 2,
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
    "point_id": 3,
    "parameter": "sound",
    "hot_point": "Rio Tempisque",
    "url": "/tempisque"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.03925, 10.84123]
    },
  "properties": {
    "type_device": "sensor",
    "location": "Canalete",
    "point_id": 4,
    "parameter": "waterLevel",
    "hot_point": "Rio Zapote",
    "url": "/upala"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.015073, 10.899812]
    },
  "properties": {
    "type_device": "alarm",
    "location": "Upala",
    "point_id": 5,
    "parameter": "sound",
    "hot_point": "Rio Zapote",
    "url": "/upala"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-85.514956, 10.775064]
    },
  "properties": {
    "type_device": "sensor",
    "location": "Los Ahogados",
    "point_id": 6,
    "parameter": "waterLevel",
    "hot_point": "Rios Los Ahogados",
    "url": "/tempisque"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-83.973055, 10.147677]
    },
  "properties": {
    "type_device": "sensor",
    "location": "Braulio Carrillo",
    "point_id": 7,
    "parameter": "vibration",
    "hot_point": "Rio Sucio",
    "url": "/ruta32"
    }
  },
  {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-83.786813, 10.211248]
    },
  "properties": {
    "type_device": "alarm",
    "location": "Guapiles",
    "point_id": 8,
    "parameter": "sound",
    "hot_point": "Rio Sucio",
    "url": "/ruta32"
    }
  },
];

const r = require('rethinkdb');                             //Servicio base datosconst jsonFile = fs.readFileSync("imn_output.json")
r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'}).then(conn => {
  console.log("rethinkdb connected");

  r.table('disaster_monitors').insert(devicesJson).run(conn, function(err, result) { console.log("error>", err, result)}); 
  }
);

