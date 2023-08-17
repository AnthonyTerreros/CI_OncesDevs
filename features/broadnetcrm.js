const { Given, When, Then } = require("@cucumber/cucumber");
const request = require("supertest");
const sql = require("mssql");
const assert = require("assert");

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

var token = "";

request(baseUrl)
  .post("api/auth")
  .send({ usuario: "anavarro", contrasena: "1234" })
  .end((err, res) => {
    token = res.body.data.token;
  });

async function getDataFromDB(query) {
  await sql.connect(config);
  const result = await sql.query(query);
  sql.close();
  return result.recordset;
}

// Cambios Test
// See Default Cambios
Given("a set of cambios maked by administrators", async () => {
  this.responseDB = await getDataFromDB(
    "SELECT TOP(10) * FROM Cambios ORDER BY fecha DESC"
  );
});

When("administrator click in cambios view", async () => {
  this.responseAPI = await request(baseUrl)
    .get("api/cambios/filter?page=1")
    .set("Authorization", "Bearer " + token);
});

Then(
  "administrator going to see all the changes registered in the system",
  () => {
    this.responseDB.forEach((cambio, index) => {
      assert.equal(cambio.id, this.responseAPI.body.items[index].id);
    });
  }
);

// Test 2
Given(
  "a number of changes that administrator wants to see",
  async (dataTable) => {
    let data = dataTable.hashes();
    this.pageSize = data[0].Number;
    this.responseDB = await getDataFromDB(
      "SELECT TOP(15) * FROM Cambios ORDER BY fecha DESC"
    );
  }
);

When("administrator click on filter1 button", async () => {
  this.responseAPI = await request(baseUrl)
    .get(`api/cambios/filter?page=1&pageSize=${this.pageSize}`)
    .set("Authorization", "Bearer " + token);
});

Then("administrator going to see all changes", () => {
  this.responseDB.forEach((cambio, index) => {
    assert.equal(cambio.id, this.responseAPI.body.items[index].id);
  });
});

// Test 3
Given(
  "the ids of the users that maded change in the other user",
  async (dataTable) => {
    let data = dataTable.hashes();
    this.idUsuarioAdmin = data[0].idUsuarioAdmin;
    this.idUsuarioCambiado = data[0].idUsuarioCambiado;
    this.UsuarioAdmin = data[0].UsuarioAdmin;
    this.UsuarioCambiado = data[0].UsuarioCambiado;
    this.responseDB =
      await getDataFromDB(`SELECT TOP(24) * FROM [broadnetcrm].[dbo].[Cambios]
    WHERE [Cambios].[idUsuarioAdmin] = ${this.idUsuarioAdmin} AND [Cambios].[idUsuarioCambiado] = ${this.idUsuarioCambiado}
    ORDER BY [Cambios].[fecha] DESC`);
  }
);

When("administrator click on filter2 button", async () => {
  this.responseAPI = await request(baseUrl)
    .get(
      `api/cambios/filter?usuarioCambiado=${this.UsuarioCambiado}&usuarioAdmin=${this.UsuarioAdmin}`
    )
    .set("Authorization", "Bearer " + token);
});

Then("administrator going to see all changes by selected inputs", () => {
  assert.equal(this.responseDB.length, this.responseAPI.body.count);
});

// Test 4
Given("the id of the user that will be disable", async (dataTable) => {
  let data = dataTable.hashes();
  let idUser = data[0].idUser;
  this.responseDB = await getDataFromDB(
    `SELECT * FROM Usuarios WHERE id = ${idUser}`
  );
  this.userName = this.responseDB[0].usuario;
});

When("administrator click on disable user", async () => {
  this.responseAPI = await request(baseUrl)
    .put(`api/usuario/inhabilitar-usuario/${this.userName}`)
    .set("Authorization", "Bearer " + token)
    .send({ tipo: "I" });
});

Then("administrator going to see the user disabled", () => {
  assert.equal(this.responseAPI.status, 200);
});

// Test 5
Given(
  "dates for the activities that administrator want to see",
  async (dataTable) => {
    let data = dataTable.hashes();
    this.initDate = data[0].initDate;
    this.endDate = data[0].endDate;
    this.responseDB =
      await getDataFromDB(`SELECT * FROM [broadnetcrm].[dbo].[Requerimientos]
      JOIN [broadnetcrm].[dbo].[Actividades] ON [actividadId] = [Actividades].[id]
      WHERE [fecha] >= '${this.initDate}' AND [fecha_fin] <= '${this.endDate}'`);
  }
);

When("administrator click on filter activities button", async () => {
  this.responseAPI = await request(baseUrl)
    .get(
      `api/actividad/dashbord-filter?fecha_inicio="${this.initDate}"&fecha_fin="${this.endDate}"`
    )
    .set("Authorization", "Bearer " + token);
});

Then(
  "administrator going to see the table with the filtered activities",
  () => {
    assert.equal(this.responseDB.length, this.responseAPI.body.length);
  }
);

// Test 6

Given(
  "the id of the user that will be reset his password",
  async (dataTable) => {
    let data = dataTable.hashes();
    this.idUser = data[0].idUser;
    this.responseDB = await getDataFromDB(
      `SELECT * FROM Usuarios WHERE id = '${this.idUser}'`
    );
    this.user = this.responseDB[0];
  }
);

When("administrator click on reset password", async () => {
  this.responseAPI = await request(baseUrl)
    .put("api/usuario/resetear-constrasena/24")
    .set("Authorization", "Bearer " + token)
    .send(this.user);
});

Then("system going to send the new password via email", () => {
  assert.equal(this.responseAPI.status, 200);
});

// Test 7

Given("the user information", (dataTable) => {
  let data = dataTable.hashes();
  this.name = data[0].name;
  this.lastname = data[0].lastname;
  this.email = data[0].email;
  this.cedula = data[0].cedula;
  this.password = data[0].password;
  this.username = data[0].username;
});

When("administrator click on register user", async () => {
  let empleado = {
    nombre: this.name,
    apellido: this.lastname,
    cedula: this.cedula,
    fechaNacimiento: new Date().toJSON().replace("T", " ").replace("Z", " "),
    telefono: "0932444444",
    direccion: "Ceibos",
    correo: this.email,
    usuarioId: 15,
    name_user: this.username,
    jefe: 0,
    tipo: "0",
    jefeId: 0,
  };
  this.resultAPIEmployee = await request(baseUrl)
    .post("api/empleado")
    .set("Authorization", "Bearer " + token)
    .send(empleado);

  const responseDB = await getDataFromDB(
    `SELECT TOP(1) * FROM Empleados ORDER BY id DESC`
  );

  let user = {
    usuario: empleado.name_user,
    contrasena: this.password,
    empleadoId: responseDB[0].id,
    rolId: 2,
    rol: "",
    idPadre: 0,
    recibeasignaciones: 0,
    estado: 1,
    intentos: 0,
  };

  this.resultAPIUser = await request(baseUrl)
    .post("api/usuario")
    .set("Authorization", "Bearer " + token)
    .send(user);
});

Then("system going to send the new crendentials in the user email", () => {
  assert.equal(this.resultAPIEmployee.status, 200);
  assert.equal(this.resultAPIUser.status, 200);
});
