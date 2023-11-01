const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job.js')
const {StatusCodes} = require('http-status-codes')



const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req, res) => {
    const {
        user: {userId}, 
        params: {id: jobId}
    } = req // request.user=userID, req.params=jobId

    const job = await Job.findOne({
        _id: jobId, 
        createdBy: userId
    })
    if (!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;//Define el usuario que crea el job
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId}, 
        params: {id: jobId}
    } = req // request.user=userID, req.params=jobId  
    
    if (company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({
        _id: jobId, 
        createdBy: userId}, 
        req.body, {new: true})
    
    if (!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
    const {
        user: {userId}, 
        params: {id: jobId}
    } = req // request.user=userID, req.params=jobId

    const job = await Job.findByIdAndRemove({
        _id: jobId, 
        createdBy: userId
    })
    if (!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).send("Job deleted sucessfully!")
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}