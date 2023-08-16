// const { Builder, By, Key, until } = require("selenium-webdriver");
// require("selenium-webdriver/firefox");

// const baseURL = "https://localhost:5000";

// const driver = new Builder().forBrowser("firefox").build();

// async function getElementById(id) {
//   const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime);
//   return await driver.wait(until.elementIsVisible(el), waitUntilTime);
// }

// describe("Integration Test Dashboard Activities - Load Charts", () => {
//   beforeAll(async () => {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;
//     await driver.get(`${baseURL}/actividades/dashboard`);
//   });

//   afterAll(async () => {
//     await driver.quit();
//   }, 15000);

//   it("Show All Chart - should show four chart with data - PASS", async () => {
//     let form = driver.findElement(By.css("form"));
//     let initDate = form.findElement(By.name("dp"));
//     let endDate = form.findElement(By.name("dp1"));
//     initDate.sendKeys("01/07/2023");
//     endDate.sendKeys("31/07/2023");

//     let btnFilter = driver.findElement(By.css("input[type=submit]"));
//     btnFilter.click();

//     let chart1 = await getElementById("#chart1");
//     let title_chart1 = chart1.findElement(By.css("h2")).getText();
//     expect(title_chart1).toEqual("Responsable y Canal utilizado");

//     let chart2 = await getElementById("#chart2");
//     let title_chart2 = chart2.findElement(By.css("h2")).getText();
//     expect(title_chart2).toEqual("Actividades por día");

//     let chart3 = await getElementById("#chart3");
//     let title_chart3 = chart3.findElement(By.css("h2")).getText();
//     expect(title_chart3).toEqual("Top 10 PVs con más Actividades");

//     let chart4 = await getElementById("#chart4");
//     let title_chart4 = chart4.findElement(By.css("h2")).getText();
//     expect(title_chart4).toEqual("Por motivo y tipo problema");

//   });
// });
