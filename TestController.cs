using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using adms.databridgeclient.ManagementSvc;

namespace DataBridgeWeb.Controllers
{
    public class TestController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GetConfig()
        {
            try
            {
                using (var svc = new ManagementSvcClient())
                {
                    var config = svc.GetConfig();
                    return Json(new { dataBridge = config, scenarios = GetScenarioConfig() }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new {result = false}, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetScenarioRuns(int id)
        {
            try
            {
                // todo: query the database for the list of scenarios that have already been run
                return Json(new
                {
                    scenarioId = id,
                    result = true,
                    runs = new[]
                    {
                        new
                        {
                            scenarioRunId = 0,
                            description = "Testing different turbine",
                            timeStamp = DateTime.Now.AddDays(-5),
                            runTime = TimeSpan.FromSeconds(967),
                            parameters = new object[]
                            {
                                new { name = "Example INT",    type="int",    value="5" },
                                new { name = "Example FLOAT",  type="float",  value="1.1" },
                                new { name = "Example STRING", type="string", value="Hello" },
                                new { name = "Example DDL",    type="ddl",    value="First Option" },
                                new { name = "Example CSV",    type="csv",    value="1,2,3,4,5,6"}
                            }
                        },
                        new
                        {
                            scenarioRunId = 1,
                            description = "Testing different operating rules",
                            timeStamp = DateTime.Now.AddDays(-4),
                            runTime = TimeSpan.FromSeconds(902),
                            parameters = new object[]
                            {
                                new { name = "Example INT",    type="int",    value="5" },
                                new { name = "Example FLOAT",  type="float",  value="9.1" },
                                new { name = "Example STRING", type="string", value="GoForIt" },
                                new { name = "Example DDL",    type="ddl",    value="Second Option" },
                                new { name = "Example CSV",    type="csv",    value="3,4,5,6,7,8"}
                            }
                        }
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetScenarioRunResults(int id)
        {
            try
            {
                // todo: query the database for the list of scenarios that have already been run
                return Json(new
                {
                    scenarioRunId = id,
                    result = true,
                    results = new[]
                    {
                        new
                        {
                            id = 0,
                            name = "Lake Level",
                            values = new[]
                            {
                                new { time = DateTime.Today.AddDays(-10),value = 1.0},
                                new { time = DateTime.Today.AddDays(-9), value = 1.1},
                                new { time = DateTime.Today.AddDays(-8), value = 1.2},
                                new { time = DateTime.Today.AddDays(-7), value = 1.2},
                                new { time = DateTime.Today.AddDays(-6), value = 1.1},
                                new { time = DateTime.Today.AddDays(-5), value = 1.1},
                                new { time = DateTime.Today.AddDays(-4), value = 1.0},
                                new { time = DateTime.Today.AddDays(-3), value = 1.2},
                                new { time = DateTime.Today.AddDays(-2), value = 1.2},
                                new { time = DateTime.Today.AddDays(-1), value = 1.1},
                                new { time = DateTime.Today.AddDays(-0), value = 0.9}
                            }
                        },
                        new
                        {
                            id = 0,
                            name = "Power Output",
                            values = new[]
                            {
                                new { time = DateTime.Today.AddDays(-10),value = 55.2},
                                new { time = DateTime.Today.AddDays(-9), value = 67.2},
                                new { time = DateTime.Today.AddDays(-8), value = 99.1},
                                new { time = DateTime.Today.AddDays(-7), value = 55.5},
                                new { time = DateTime.Today.AddDays(-6), value = 45.5},
                                new { time = DateTime.Today.AddDays(-5), value = 40.2},
                                new { time = DateTime.Today.AddDays(-4), value = 38.3},
                                new { time = DateTime.Today.AddDays(-3), value = 33.2},
                                new { time = DateTime.Today.AddDays(-2), value = 23.0},
                                new { time = DateTime.Today.AddDays(-1), value = 22.1},
                                new { time = DateTime.Today.AddDays(-0), value = 19.9}
                            }
                        }
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        private object GetScenarioConfig()
        {
            return new[]
            {
                new { id = 1, name = "Temengor Historical", config = GetTestScenarioConfig() },
                new { id = 2, name = "Temengor Synthetic", config = GetTestScenarioConfig() }
            };
        }

        private object GetTestScenarioConfig()
        {
            return new {
                parameters = new object[]
                    {
                        new { name = "Example INT",    type="int",    defaultValue="0",            description="Example parameter of type integer" },
                        new { name = "Example FLOAT",  type="float",  defaultValue="0.0",          description="Example parameter of type float" },
                        new { name = "Example STRING", type="string", defaultValue="TEST",         description="Example parameter of type string" },
                        new { name = "Example DDL",    type="ddl",    defaultValue="First Option", description="Example parameter with drop down list", values = new string[] { "First Option","Second Option","Third Option" } },
                        new { name = "Example CSV",    type="csv",    defaultValue="First Option", description="Example parameter of type CSV"}
                    }
            };
        }

        public JsonResult GetPlugins()
        {
            try
            {
                using (var svc = new ManagementSvcClient())
                {
                    var config = svc.GetPlugins();
                    return Json(config, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetData(string uri)
        {
            Console.WriteLine("Inside GetData");
            try
            {
                /*using (var svc = new ManagementSvcClient())
                {
                    var config = svc.GetPlugins();
                    return Json(config, JsonRequestBehavior.AllowGet);
                }*/

                // todo: query the real URI for real data
                
                return Json(new
                {
                    result = true,
                    message = "",
                    uri = uri,
                    values = new[]
                    {
                        new {timeStamp = DateTime.Now.AddHours(-10), value=0},
                        new {timeStamp = DateTime.Now.AddHours(-9), value=1},
                        new {timeStamp = DateTime.Now.AddHours(-8), value=2},
                        new {timeStamp = DateTime.Now.AddHours(-7), value=4},
                        new {timeStamp = DateTime.Now.AddHours(-6), value=2},
                        new {timeStamp = DateTime.Now.AddHours(-5), value=1},
                        new {timeStamp = DateTime.Now.AddHours(-4), value=0},
                        new {timeStamp = DateTime.Now.AddHours(-3), value=-1},
                        new {timeStamp = DateTime.Now.AddHours(-2), value=0},
                        new {timeStamp = DateTime.Now.AddHours(-1), value=1},
                        new {timeStamp = DateTime.Now.AddHours(0), value=2}
                    } 
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}