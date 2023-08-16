const request = require("supertest");
// const sql = require("mssql");
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// const configDB = `Server=localhost,1433;Database=broadnetcrm;User Id=Anthony;Password=123;Encrypt=true`;
// Server=DANPC,1433;Database=broadnetcrm;User Id=Anthony;Password=123;Encrypt=true
// Server=DANPC,1433;Database=broadnetcrm;User Id=Anthony;Password=123;Encrypt=true
// broadnetcrm": "Server=DANPC;Database=broadnetcrm;uid=ironpxs;uid=Anthony;pwd=123;

// const config = {
//   server: "DANPC",
//   database: "broadnetcrm",
//   port: 1433,
//   user: "Anthony",
//   password: "123",
//   trustServerCertificate: true,
//   options: {
//     cryptoCredentialsDetails: {
//       minVersion: "TLSv1",
//       trustServerCertificate: true,
//     },
//   },
// };

// async function getDataFromDB(query) {
//   await sql.connect(config);
//   const result = await sql.query(query);
//   console.log(result.recordset);
//   sql.close();
// }

// getDataFromDB(`SELECT TOP(1) *, CAST([Cambios].[fecha] as nvarchar(max)) as 'fecha' FROM Cambios ORDER BY fecha DESC`);
// // console.log(ojbs)
// console.log('te pica el culo')
const baseUrl = "https://localhost:5001/";

// request(baseUrl)
//   .post("api/auth")
//   .send({ usuario: "anavarro", contrasena: "1234" })
//   .end(function (err, res) {
//     console.log(err);
//     console.log(res);

//     // token = res.body.data.token;
//     // done();
//   });
function armarParametersFilter(
  usuarioCambiado,
  usuarioAdmin,
  fecha,
  tipo,
  numberPage,
  pageSize
) {
  let filterString = "";
  if (usuarioCambiado) filterString += "usuarioCambiado=" + usuarioCambiado;
  if (usuarioAdmin) filterString += "&usuarioAdmin=" + usuarioAdmin;
  if (fecha) filterString += "&fecha=" + fecha;
  if (tipo) filterString += "&tipo=" + tipo;
  if (numberPage) filterString += "&page=" + numberPage;
  if (pageSize) filterString += "&pageSize=" + pageSize;
  return filterString;
}

var token = "";

async function init_appP() {
  await request(baseUrl)
    .post("api/auth")
    .send({ usuario: "anavarro", contrasena: "1234" })
    .end(function (err, res) {
      // console.log(err)
      //   console.log(res);
      token = res.body.data.token;
      // done();
    });

  let userChange = "adeleortiz";
  let userAdmin = "anavarro";
  let dateSearch = new Date("06/20/2023").toISOString();
  let tipo = "CORREO";
  let page = 1;
  let pageSize = 20;
  let params = armarParametersFilter(
    userChange,
    userAdmin,
    dateSearch,
    tipo,
    page,
    pageSize
  );
  console.log(params);
  const response = await request(baseUrl)
    .get(`api/cambios/filter?${params}`)
    .set("Authorization", "Bearer " + token);
  console.log(response);
}

init_appP();
