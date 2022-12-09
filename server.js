/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ___TIANCHEN ZHANG________ Student ID: ___101569218_______ Date: __2022/11/27_______
*
* Online (herokuapp) URL:
* __https://peaceful-lowlands-02434.herokuapp.com/
*
********************************************************************************/ 

<<<<<<< HEAD
var express = require("express");
var exphbs = require("express-handlebars");
var dataServiceAuth = require("./data-service-auth.js");
var clientSessions = require("client-sessions");
var app = express();
var path = require("path")
var multer = require("multer")
var fs = require("fs")
=======
>>>>>>> 54fd546f47c680b0f2fa27090f5ef1b2cf2c0da7

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
//const bodyParser = require("body-parser");
const fs = require("fs");
//const exphbs = require("express-handlebars");
const {engine} = require("express-handlebars");
const data_service = require("./data-service.js");

<<<<<<< HEAD
// setup http server to listen on HTTP_PORT 
app.use(express.static('public'));
//assignement 6

app.use(
    clientSessions({
        cookieName: "session", 
        secret: "assignment 6", 
        duration: 2 * 60 * 1000, 
        activeDuration: 1000 * 60 
    })
);

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});


function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}



//assignment 4

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/,"");
    next();
});


app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main', helpers: {
    navLink: function(url, options){
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    },
    // each: function(context, options) {
    //     var ret = "";
    
    //     for(var i=0, j=context.length; i<j; i++) {
    //         ret = ret + options.fn(context[i]);
    //     }
    
    
    //     return ret;
    // }

}}));

app.set('view engine', '.hbs');

//



//GET route for "/" to "render" the "home" view, instead of sending home.html

app.get("/", (req,res)=>{
    res.render("home");
});


app.get("/about",(req,res)=>{
    res.render("about");
}
);

app.get("/login",(req,res)=>{
    res.render("login");
}
);

app.get("/register",(req,res)=>{
    res.render("register");
}
);

/*GET /logout
• This "GET" route will simply "reset" the session (Hint: refer to the Week 10 notes) and redirect the user to
the "/" route, ie: res.redirect('/');
*/
app.get("/logout",(req,res)=>{
    req.session.reset();
    res.redirect("/");
}
);

// GET /userHistory
// • This "GET" route simply renders the "userHistory" view without any data (See userHistory.hbs under “Adding
// New Routes” below). IMPORTANT NOTE: This route (like the 14 others above) must also be protected by your
// custom ensureLogin helper middleware.

app.get("/userHistory",ensureLogin,(req,res)=>{
    res.render("userHistory");
}
);



app.get("/employees/add",ensureLogin,(req,res)=>{
    dataService.getDepartments()
    .then((data)=>{
        res.render("addEmployee",{departments:data});
    })
    .catch(()=>{
        res.render("addEmployee",{departments:[]});
    })
}
);
app.get("/images/add",ensureLogin,(req,res)=>{
    res.render("addImage");
}
);


app.get("/departments/add",ensureLogin,(req,res)=>{
    res.render("addDepartment");
}
);



app.get("/employees",ensureLogin, (req,res)=>{
    if(req.query.status){
        dataService.getEmployeesByStatus(req.query.status).then((data)=>{
            if(data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees",{message:"no results"});
            }
        }).catch((err)=>{
            res.render({message:"no results"});
        });
    }else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query.department).then((data)=>{
            if(data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees",{message:"no results"});
            }
        }).catch((err)=>{
            res.render({message:"no results"});
        });
    }else if(req.query.manager){
        dataService.getEmployeesByManager(req.query.manager).then((data)=>{
            if(data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees",{message:"no results"});
            }
        }).catch((err)=>{
            res.render({message:"no results"});
        });
    }else{
        dataService.getAllEmployees().then((data)=>{
            if(data.length>0){
                res.render("employees",{employees:data});
            }else{
                res.render("employees",{message:"no results"});
            }
        }).catch((err)=>{
            res.render({message:"no results"});
        });
    }
}
);





app.get("/departments", ensureLogin,(req,res)=>{
    dataService.getDepartments().then((data)=>{
        if(data.length>0){
            res.render("departments",{departments:data});
        }else{
            res.render("departments",{message:"no results"});
        }
    }).catch((err)=>{
        res.render({message:"no results"});
    });
}
);



app.get("/department/:departmentId",ensureLogin, (req,res)=>{
    dataService.getDepartmentById(req.params.departmentId).then((data)=>{
        if(data){
            res.render("department",{department:data});
        }else{
            res.status(404).send("Department Not Found");
        }
    }).catch((err)=>{
        res.status(404).send("Department Not Found");
    });
}   
);








// app.get("/employee/:empNum", (req, res) => {
//     dataService.getEmployeeByNum(req.params.empNum).then((data) => {
//         res.render("employee", { employee: data });
//     }).catch((err) => {
//         res.render("employee", { message: "no results" });
//     });
// });

app.get("/employee/:empNum", ensureLogin,(req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as
   "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
   13
    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true;
    }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
   });


   
app.get("/employees/delete/:empNum", ensureLogin,(req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum).then((data) => {
    res.redirect("/employees");
    }).catch((err) => {
    res.status(500).send("Unable to Remove Employee / Employee not found)");
    });
    });



const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        /* we write the filename as the current date down to the millisecond
            in a large web service this would possibly cause a problem 
            if two people uploaded an image at the exact same time.
            A better way would be to use GUID's for file names
        */
       cb(null, Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});





 app.get("/images",ensureLogin, (req, res) => {
     fs.readdir("./public/images/uploaded", (err, items) => {
        res.render("images", {images: items});
     });
 });









app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/employees/add", (req, res) => {  
    dataService.addEmployee(req.body).then((data)=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Add Employee");
    });
});



app.post("/employee/update", (req, res) => {    
    dataService.updateEmployee(req.body).then((data)=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
    });
});


app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body).then((data)=>{
        res.redirect("/departments");
    }
    ).catch((err)=>{
        res.status(500).send("Unable to Add Department");
    }
    );
});

app.post("/department/update", (req, res) => {
    dataService.updateDepartment(req.body).then((data)=>{
        res.redirect("/departments");
    }
    ).catch((err)=>{
       res.status(500).send("Unable to Update Department");
    }
    );
});

/*POST /register
• This "POST" route will invoke the dataServiceAuth.registerUser(userData) method with the POST data (ie:
req.body).
o If the promise resolved successfully, render the register view with the following data:
{successMessage: "User created"}
o If the promise was rejected (err), render the register view with the following data:
{errorMessage: err, userName: req.body.userName} - NOTE: we are returning the user back to the
page, so the user does not forget the user value that was used to attempt to register with the system
*/

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body).then((value)=>{
        res.render("register", {successMessage: "User created"});
    }).catch((err)=>{
        res.render("register", {errorMessage: err, userName: req.body.userName});
    }); 
});


/*POST /login
• The User-Agent request header contains a characteristic string that allows the network protocol peers to identify
the application type, operating system, software vendor or software version of the requesting software user
agent (MDN). Before we do anything, we must set the value of the client's "User-Agent" to the request body
6
property, ie:
req.body.userAgent = req.get('User-Agent');
• Next, we must invoke the dataServiceAuth.checkUser(userData) method with the POST data (ie: req.body).
o If the promise resolved successfully, add the returned user's userName, email & loginHistory to the
session and redirect the user to the "/employees" view, ie:
dataServiceAuth.checkUser(req.body).then((user) => {
 req.session.user = {
 userName: … // complete it with authenticated user's userName
 email: … // complete it with authenticated user's email
 loginHistory: … // complete it with authenticated user's loginHistory
 }
 res.redirect('/employees');
})
o If the promise was rejected (ie: in the "catch"), render the login view with the following data (where err
is the parameter of the "catch": {errorMessage: err, userName: req.body.userName} - NOTE: we are
returning the user back to the login page, so the user does not forget the user value that was used to
attempt to log into the system*/ 

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then((user) => {
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch((err)=>{
        res.render("login", {errorMessage: err, userName: req.body.userName});
    }
    );
});





app.use(function(req,res){
    res.status(404).send("Page Not Found"); 
});










dataService.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
 app.listen(HTTP_PORT, function(){
 console.log("app listening on: " + HTTP_PORT)
 });
}).catch(function(err){
 console.log("unable to start server: " + err);
});




=======
const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

/* A4 -  beginning */
// handle active route
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route=="/") ? "/" : route.replace(/\/$/,"");
    next();
});

//setting express-handlebars
app.engine(".hbs", engine(
    {
        extname: '.hbs',
        
        helpers:{
            navLink: function(url, options){
                return '<li' +
                        ((url == app.locals.activeRoute) ? ' class = "active" ' : '') +
                        '><a href="' + url + '">' + options.fn(this) + '</a> </li>';
            }, // helpers: navLink
           /* e.g.,
              {{#equal employee.status "Full Time" }}checked{{/equal}} */
            equal: function(lvalue, rvalue, options){
                if (arguments.length<3)
                    throw new Error ("Handlebars Helper equal needs 2 parameters.");
                if (lvalue != rvalue){
                    return options.inverse(this);
                } else{
                    return options.fn(this);
                }
            } // helpers:equal
        }, //// helpers
        defaultLayout: 'main'
    }
));
app.set("view engine", ".hbs");
>>>>>>> 54fd546f47c680b0f2fa27090f5ef1b2cf2c0da7


/* A4 - setting  express-handlebars - ending */

//A3- define storage destination
// multer: for form with file upload 
const storage = multer.diskStorage({
     destination: "./public/images/uploaded",
     filename: function(req, file, cb){
         cb(null, Date.now()+ path.extname(file.originalname));
     }
});
var upload = multer({storage:storage});

// body-parser: for form without file upload
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//set up default route
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/about", (req,res)=>{
    res.render("about");
});

//adding more routes
/*  A2 - 
app.get("/employees", (req,res)=>{
    data_service.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
    });
});
- A2 modified in A3, below */
//A3- part 4
app.get("/employees", (req,res)=>{
    if (req.query.status)
        {
            data_service.getEmployeesByStatus(req.query.status).then((data)=>{
               // res.json(data);
              // res.render("employees", {employees:data});
              res.render("employees", data.length>0?{employees:data}:{message:"No results"});
            }).catch((reason)=>{
                res.render({message:reason});
                //res.json({message:reason});
            });
        }
    else if (req.query.department)
            {
                data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
                   // res.json(data);
                  // res.render("employees", {employees:data});
                  res.render("employees", data.length>0?{employees:data}:{message:"No results"});
                }).catch((reason)=>res.render({message:reason}));
                //res.json({message:reason}));
            }
    
    else if (req.query.manager)
        {
            data_service.getEmployeesByManager(req.query.manager).then((data)=>{
                //res.json(data);
                //res.render("employees", {employees:data});
                res.render("employees", data.length>0?{employees:data}:{message:"No results"});
            }).catch((reason)=>res.render({message: reason}));
            //res.json({message:reason}));
        }
    else {
        data_service.getAllEmployees().then((data)=>{
           // res.json(data);
          // res.render("employees", {employees:data});
          res.render("employees", data.length>0?{employees:data}:{message:"No results"});
        }).catch((err)=>{
           // res.json({message: err});
           res.render({message: err});
        });  
    }// if no query, response all employees
    }); // end of: app.get("/employees", (req,res)=>{

app.get("/employee/:empNum",(req,res)=>{
    /* initialize an empty object to store the values of employee (obj, current employee) 
        and departments(array of objs) */
    let viewData={};

    data_service.getEmployeeByNum(req.params.empNum).then((data)=>{
       if (data) //data is the employee obj from the getEmployeeByNum()
        {
            viewData.employee=data;//store employee data (obj) in the object "viewData" as "employee" (obj, property of viewData obj)
        }else{
            viewData.employee=null;//set employee (property of viewData obj) to null if none were returned
        }
    }).catch(()=>{
        viewData.employee=null;////set employee (property of viewData obj) to null if error to get the employee
    }).then(data_service.getDepartments).
        //if getEmployeeByNum() successful, then call function getDepartments()
        then((data)=>{ 
            viewData.departments = data; //store department data in the "viewData" object as "departments"
            /* loop through viewData.departments and once we have found the 
                departmentId that matches the employee's "department" value, 
                add a "selected" property to the matching viewData.departments obj 
            */
            for (let i=0; i<viewData.departments.length; i++)
                {
                    if (viewData.departments[i].departmentId == viewData.employee.department)
                        { viewData.departments[i].selected = true;}
                }// for
         }).catch(()=>{
             viewData.departments=[]; //set departments to empty array if error in getDepartments()
         }).then(()=>{
             if (viewData.employee == null)
                { // if no employee, return error
                    res.status(404).send("Employee Not found");
                } else{
                     /* render the employee view with the data as "viewData",
                    which is an object with two properties: employee (obj, and departments (array of objs) */ 
                    res.render("employee", {viewData: viewData}); 
                }
         });
        });

app.get("/employees/delete/:empNum",(req,res)=>{
    data_service.deleteEmployeeByNum(req.params.empNum).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        console.log(err);
        res.status(500).send("Unable to remove employee.")
    });
});

app.get("/departments",(req,res)=>{
    data_service.getDepartments().then((data)=>{
        console.log(data);
        //res.json(data);
      // res.render("departments", {departments: data});
       res.render("departments",data.length>0?{departments:data}:{message:"No results."})

    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/employees/add",(req,res)=>{
    data_service.getDepartments().then((data)=>{
        res.render("addEmployee", {departments:data});
    }).catch((err)=>{
        res.render("addEmployee",{departments:[]});
    });
    
});

app.get("/images/add", (req,res)=>{
    //res.send("images");
    res.render("addImage");
});

app.get("/images",(req,res)=>{
    fs.readdir("./public/images/uploaded", function(err,items){
        // this was in A3, was changed to res.render() in A4 
        //res.json({images:items}); 
       // res.render("images");
       res.render("images", {images: items});
    });
});

app.post("/images/add",upload.single("imageFile"), (req,res)=>{
    res.redirect("/images");
 });

app.post("/employees/add", (req,res)=>{
     data_service.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
     }).catch((err)=>{
        res.render("addEmployee",{message:err});
    });
 });

/*** A3 end ****/
//A4
app.post("/employee/update",(req,res)=>{
   // console.log(req.body);
    data_service.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.render("employees, ",{message:err});
    });;
});
/****  A5 begins  ****/
app.get("/departments/add",(req,res)=>{
    //res.send("add employees");
    res.render("addDepartment");
});

app.post("/departments/add", (req, res)=>{
    data_service.addDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to add the deparmtment.");
    });
});

app.post("/department/update",(req,res)=>{
    data_service.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((err)=>{
        res.status(500).send("Unable to update the department.");
    });
});

app.get("/department/:departmentId",(req,res)=>{
    data_service.getDepartmentById(req.params.departmentId).then((data)=>{
        if (!data)
            {res.status(404).send("Department not found");}
        else
            {res.render("department",{department:data});}
    }).catch((err)=>{
        res.status(404).send("Departmen not found.");
    })
});

/****  A5 ends  ****/

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});

data_service.initialize().then(()=>{
    //listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch(()=>{
    console.log("Cannot open files.");
});