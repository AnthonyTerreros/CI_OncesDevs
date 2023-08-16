const request = require("supertest");
const sql = require("mssql");

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

describe("Final Sprint Broadnet: Testing Dashboard Activities Module => /api/actividades/dashbord-filter", () => {
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

  it("getActivitiesByFilter with init and end date - should return a list of requirements object where {initDate: 07/July/2023, endDate: 28/July/2023}", async () => {
    const responseDB =
      await getDataFromDB(`SELECT * FROM [broadnetcrm].[dbo].[Requerimientos]
      JOIN [broadnetcrm].[dbo].[Actividades] ON [actividadId] = [Actividades].[id]
      WHERE [fecha] >= '2023-07-01T05:00:00.000Z' AND [fecha_fin] <= '2023-07-31T05:00:00.000Z'`);
    const responseBackend = await request(baseUrl)
      .get(
        `api/actividad/dashbord-filter?fecha_inicio="2023-07-01T05:00:00.000Z"&fecha_fin="2023-07-31T05:00:00.000Z"`
      )
      .set("Authorization", "Bearer " + token);
    expect(responseDB.length).toBe(responseBackend.body.length);
  });

  it("getActivitiesByFilter with init and end date, and Cost Region - should return a list of objects of requeriments", async () => {
    const responseDB =
      await getDataFromDB(`SELECT * FROM [broadnetcrm].[dbo].[Requerimientos]
      JOIN [broadnetcrm].[dbo].[Actividades] ON [actividadId] = [Actividades].[id]
      WHERE [fecha] >= '2023-07-01T05:00:00.000Z' AND [fecha_fin] <= '2023-07-31T05:00:00.000Z'
      AND [region] = 'R2 - COSTA'`);
    const responseBackend = await request(baseUrl)
      .get(
        `api/actividad/dashbord-filter?fecha_inicio="2023-07-01T05:00:00.000Z"&fecha_fin="2023-07-31T05:00:00.000Z"&region=1`
      )
      .set("Authorization", "Bearer " + token);
    expect(responseDB.length).toBe(responseBackend.body.length);
  });

  it("getActivitiesByFilter with init and end date, and Sierra Region - should return a list of requirements objects", async () => {
    const responseDB =
      await getDataFromDB(`SELECT * FROM [broadnetcrm].[dbo].[Requerimientos]
      JOIN [broadnetcrm].[dbo].[Actividades] ON [actividadId] = [Actividades].[id]
      WHERE [fecha] >= '2023-07-01T05:00:00.000Z' AND [fecha_fin] <= '2023-07-31T05:00:00.000Z'
      AND [region] = 'R1 - Sierra'`);
    const responseBackend = await request(baseUrl)
      .get(
        `api/actividad/dashbord-filter?fecha_inicio="2023-07-01T05:00:00.000Z"&fecha_fin="2023-07-31T05:00:00.000Z"&region=2`
      )
      .set("Authorization", "Bearer " + token);
    expect(responseDB.length).toBe(responseBackend.body.length);
  });

  test.each([3, 4])(
    "getActivitiesByFilter with MakedBy idUser: %i - should return a list of requirements objects",
    async (idUser) => {
      const responseDB =
        await getDataFromDB(`SELECT * FROM [broadnetcrm].[dbo].[Requerimientos]
      JOIN [broadnetcrm].[dbo].[Actividades] ON [actividadId] = [Actividades].[id]
      WHERE [fecha] >= '2023-07-01T05:00:00.000Z' AND [fecha_fin] <= '2023-07-31T05:00:00.000Z'
      AND [usuarioCreadorId] = ${idUser}`);
      const responseBackend = await request(baseUrl)
        .get(
          `api/actividad/dashbord-filter?fecha_inicio="2023-07-01T05:00:00.000Z"&fecha_fin="2023-07-31T05:00:00.000Z"&solicitado_por=${idUser}`
        )
        .set("Authorization", "Bearer " + token);
      expect(responseDB.length).toBe(responseBackend.body.length);
    }
  );
});