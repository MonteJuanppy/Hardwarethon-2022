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
    "device_id": "001",
    "parameter": "waterLevel",
    "hot_point": "tempisque",
    "url": "/tempisque",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "002",
    "parameter": "sound",
    "hot_point": "tempisque",
    "url": "/tempisque",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "003",
    "parameter": "sound",
    "hot_point": "tempisque",
    "url": "/tempisque",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "004",
    "parameter": "waterLevel",
    "hot_point": "zapote",
    "url": "/upala",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "005",
    "parameter": "sound",
    "hot_point": "zapote",
    "url": "/upala",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "006",
    "parameter": "waterLevel",
    "hot_point": "ahogados",
    "url": "/tempisque",
     "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "007",
    "parameter": "vibration",
    "hot_point": "sucio",
    "url": "/ruta32",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
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
    "device_id": "008",
    "parameter": "sound",
    "hot_point": "sucio",
    "url": "/ruta32",
    "update": Date("yyyy-MM-dd'T'HH:mm:ssZ"),
    }
  },
];

const r = require('rethinkdb');                             //Servicio base datosconst jsonFile = fs.readFileSync("imn_output.json")
r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'}).then(conn => {
  console.log("rethinkdb connected");

  r.table('disaster_monitors').insert(devicesJson).run(conn, function(err, result) { console.log("error>", err, result)}); 
  }
);

