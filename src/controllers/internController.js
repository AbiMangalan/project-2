const collegeModel = require('../models/collegeModel');
const internModel = require("../models/internModel");
const validators = require('../validators/validator');

const createIntern = async function(req, res) 
{
    try 
    {
        let requestBody = req.body;

        if (!validators.isValidRequestBody(requestBody))

            return res.status(400).send({ status: false, message: "Invalid request body. Please provide Intern details." });

        if (!validators.isValidField(requestBody.name)) 
        
            return res.status(400).send({ status: false, message: "Name is required." });
        
        if (!validators.isValidField(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: "Email is required." });
        
        if (!validators.isValidField(requestBody.mobile)) 
        
            return res.status(400).send({ status: false, message: "Mobile Number is required." });
        
        if(!validators.isValidMobileNo(requestBody.mobile))

            return res.status(400).send({ status: false, message: "Please enter a valid mobile number." });
        
        if (!validators.isValidField(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: "Email id is required." });
        
        if (!validators.isValidEmail(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: "Enter Valid email Id." });

        if (!validators.isValidField(requestBody.collegeName)) 
        
            return res.status(400).send({ status: false, message: "collegeName is Required." });
        
        if(req.body.isDeleted!=undefined)

            return res.status(400).send({status : false, message : "Invalid field (isDeleted) in request body."});

        let temp = requestBody.mobile;
        requestBody.mobile = temp.slice(-10);
        let emailAndMobileExists = await internModel.findOne({ $or : [{ mobile : requestBody.mobile },{ email : requestBody.email }] });
        if(emailAndMobileExists)
    
            return res.status(400).send({status : false, message : "Email id or mobile number has already been registered."});
        
        let college = await collegeModel.findOne({ name: requestBody.collegeName, isDeleted : false },{ _id: 1 });
        if (college == null) 
        
            return res.status(400).send({ status: false, message: "College not found!" });
        
        requestBody['collegeId']=college._id;
        const createIntern = await internModel.create(requestBody);
        return res.status(201).send(  {status : true, data : createIntern });
    } 
    catch (err) 
    {
        res.status(500).send({ status: false, data: createIntern, message: err.message });
    }
};

module.exports.createIntern = createIntern