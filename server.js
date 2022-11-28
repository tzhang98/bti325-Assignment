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
var dataService= require("./data-service")
var HTTP_PORT = process.env.PORT || 8080;
//const department = require("./data/departments.json");
//const employee = require("./data/employees.json");

var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var path = require("path")
var multer = require("multer")
var fs = require("fs")

// setup a 'route' to listen on the default url path

// setup http server to listen on HTTP_PORT 
app.use(express.static('public'));

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


app.get("/employees/add",(req,res)=>{
    dataService.getDepartments()
    .then((data)=>{
        res.render("addEmployee",{departments:data});
    })
    .catch(()=>{
        res.render("addEmployee",{departments:[]});
    })
}
);
app.get("/images/add",(req,res)=>{
    res.render("addImage");
}
);


app.get("/departments/add",(req,res)=>{
    res.render("addDepartment");
}
);



app.get("/employees", (req,res)=>{
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





app.get("/departments", (req,res)=>{
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



app.get("/department/:departmentId", (req,res)=>{
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

app.get("/employee/:empNum", (req, res) => {
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


   
app.get("/employees/delete/:empNum", (req, res) => {
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



 app.get("/images", (req, res) => {
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




app.use(function(req,res){
    res.status(404).send("Page Not Found"); 
});







dataService.initialize().then(()=>{
    app.listen(HTTP_PORT,onHttpStart);
}).catch((err)=>{
    console.log(err);
});





function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}





