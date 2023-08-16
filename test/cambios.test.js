const request = require("supertest");
const sql = require("mssql");
var moment = require("moment");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseUrl = "https://localhost:5001/";
const config = {
  server: "DANPC",
  database: "broadnetcrm",
  port: 1433,
  user: "Anthony",
  password: "123",
  trustServerCertificate: true,
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      trustServerCertificate: true,
    },
  },
};

async function getDataFromDB(query) {
  await sql.connect(config);
  const result = await sql.query(query);
  sql.close();
  return result.recordset;
}

describe("Spring 1 - BroadtNet: Testing API REST Cambios Controller - /api/cambios", () => {
  var token = "";

  beforeAll((done) => {
    request(baseUrl)
      .post("api/auth")
      .send({ usuario: "anavarro", contrasena: "1234" })
      .end((err, res) => {
        token = res.body.data.token;
        done();
      });
  });

  it("getAllCambios - api/cambios/all", async () => {
    const responseDB = await getDataFromDB(`SELECT * FROM Cambios`);
    const response = await request(baseUrl)
      .get("api/cambios/all")
      .set("Authorization", "Bearer " + token);
    expect(response.body.length).toBe(responseDB.length);
  });

  it("getCambiosById - Search Cambio For Id api/cambios/{id}", async () => {
    const resposneDb = await getDataFromDB(
      `SELECT * FROM Cambios WHERE id = 1`
    );
    let id = 1;
    const response = await request(baseUrl)
      .get(`api/cambios/${id}`)
      .set("Authorization", "Bearer " + token);
    expect(response.body.id).toBe(resposneDb[0].id);
  });

  it('getCambiosWithFilterParamsByParams where usuarioCambio = adeleortiz, usuarioAdmin = anavarro, fecha = "20/06/2023", tipo = CORREO, page = 1 and pagesize = 20 - api/cambios/filter', async () => {
    const resposneDb = await getDataFromDB(
      `SELECT [Cambios].[id], [Cambios].[idUsuarioAdmin], [Cambios].[idUsuarioCambiado], [Cambios].[tipo], [Cambios].[fecha]  FROM [broadnetcrm].[dbo].[Cambios]
      FULL OUTER JOIN [broadnetcrm].[dbo].[Usuarios] ON [idUsuarioCambiado] = [Usuarios].[id]
      WHERE [Cambios].[idUsuarioAdmin] = 4 AND [Cambios].[idUsuarioCambiado] = 24 AND [Cambios].[tipo] = 'CORREO' AND [Cambios].[fecha] BETWEEN '2023/06/20 00:00:00' AND '2023/06/20 23:59:59'
      ORDER BY [Cambios].[fecha] DESC`
    );
    const response = await request(baseUrl)
      .get(
        `api/cambios/filter?usuarioCambiado=adeleortiz&usuarioAdmin=anavarro&fecha="2023-06-20T05:00:00.000Z"&tipo=CORREO&pageSize=20`
      )
      .set("Authorization", "Bearer " + token);
    expect(response.body.items.length).toBe(resposneDb.length);
  });

  it("createCambio - api/cambios/create", async () => {
    let newCambio = {
      idUsuarioCambiado: 14,
      idUsuarioAdmin: 4,
      fecha: new Date().toJSON().replace("T", " ").replace("Z", " "),
      tipo: "CORREO",
    };
    const response = await request(baseUrl)
      .post("api/cambios/create")
      .set("Authorization", "Bearer " + token)
      .send(newCambio);
    expect(response.body.success).toBe(1);
  });
});

describe("Sprint 1 Broadnet: Testing Cambios Module => /api/cambios/filter", () => {
  var token = "";

  beforeAll((done) => {
    request(baseUrl)
      .post("api/auth")
      .send({ usuario: "anavarro", contrasena: "1234" })
      .end((err, res) => {
        token = res.body.data.token;
        done();
      });
  });
  it("getCambiosWithFilterParamsByAdministratorUser where user is anavarro - api/cambios/filter", async () => {
    let userAdmin = "anavarro";
    const resposneDb = await getDataFromDB(
      `SELECT * FROM Cambios WHERE idUsuarioAdmin = 4 ORDER BY fecha DESC`
    );
    let pageSize = resposneDb.length;
    const response = await request(baseUrl)
      .get(
        `api/cambios/filter?page=1&usuarioAdmin=${userAdmin}&pageSize=${pageSize}`
      )
      .set("Authorization", "Bearer " + token);
    expect(response.body.items.length).toBe(resposneDb.length);
  });

  it("getCambiosWithFilterParamsByChangedUser where changedUser is adeleortiz  - api/cambios/filter", async () => {
    let changedUser = "anavarro";
    const resposneDb = await getDataFromDB(
      `SELECT TOP(10) * FROM Cambios WHERE idUsuarioAdmin = 24 ORDER BY fecha DESC`
    );
    let pageSize = resposneDb.length;
    const response = await request(baseUrl)
      .get(
        `api/cambios/filter?page=1&usuarioCambiado=${changedUser}&pageSize=${pageSize}`
      )
      .set("Authorization", "Bearer " + token);
    expect(response.body.items.length).toBe(resposneDb.length);
  });

  it("getCambiosWithFilterParamsByTypeChange where changedUser is PASSWORD  - api/cambios/filter", async () => {
    let type = "CONSTRASE%C3%91A";
    const resposneDb = await getDataFromDB(
      `SELECT TOP(10) * FROM Cambios WHERE tipo = 'CONSTRASEÑA' ORDER BY fecha DESC`
    );
    let pageSize = resposneDb.length;
    const response = await request(baseUrl)
      .get(`api/cambios/filter?page=1&tipo=${type}&pageSize=${pageSize}`)
      .set("Authorization", "Bearer " + token);
    expect(response.body.items.length).toBe(resposneDb.length);
  });

  it("getCambiosWithFilterParamsByTypeChange where changedUser is EMAIL  - api/cambios/filter", async () => {
    let type = "CORREO";
    const resposneDb = await getDataFromDB(
      `SELECT TOP(10) * FROM Cambios WHERE tipo = 'CORREO' ORDER BY fecha DESC`
    );
    let pageSize = resposneDb.length;
    const response = await request(baseUrl)
      .get(`api/cambios/filter?page=1&tipo=${type}&pageSize=${pageSize}`)
      .set("Authorization", "Bearer " + token);
    expect(response.body.items.length).toBe(resposneDb.length);
  });

  it("getCambiosWithFilterParamsByDate where date is 09/06/2023  - api/cambios/filter", async () => {
    const resposneDb = await getDataFromDB(
      `SELECT TOP(10) * FROM Cambios WHERE fecha BETWEEN '2023/06/09 00:00:00' AND '2023/06/09 23:59:59' ORDER BY fecha DESC`
    );
    let pageSize = resposneDb.length;
    const response = await request(baseUrl)
      .get(
        `api/cambios/filter?page=1&fecha="2023-06-09T05:00:00.000Z"&pageSize=${pageSize}`
      )
      .set("Authorization", "Bearer " + token);

    expect(response.body.items.length).toBe(resposneDb.length);
  });
});