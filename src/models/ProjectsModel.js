const { default: mongoose } = require("mongoose");


const projectsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    demoLink: {
        type: String,
        required: true
    },
    repoLink: {
        type: String,
        required: true
    },
    techs: {
        type: String,
        required: true
    },
    thumbnail: {
        id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url : {
                type: String,
                required: true
            },
            caption: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true })

const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectsSchema)

export default ProjectModel;