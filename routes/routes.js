const express = require('express');
const router = express.Router();
const Resume = require('../models/resume');
const jwt = require('jsonwebtoken')
// const User = require('../models/user');
const { reqauth, checkuser } = require('../middlewares/auth');
router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.redirect('/resumes');
});

router.get('/resumes/create', reqauth, checkuser, (req, res) => {
    res.render('create', { title: 'Creative' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

router.get('/resume/:id/download', (req, res) => {
    const id = req.params.id;
  
    // Get the resume data from the database using the id
    const result = Resume.findByPk(id);
    // Render the resume as HTML using EJS
    const html = ejs.render('details', { resume: result, title: 'Resumes Details' })
  
    // Set the options for html2pdf
    const options = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    // Use html2pdf to generate the PDF file
    html2pdf().from(html).set(options).toFile('./resume.pdf', (err, result) => {
      if (err) return console.log(err);
      
      // Send the PDF file as a download attachment
      const file = path.resolve('./resume.pdf');
      res.download(file, (err) => {
        if (err) return console.log(err);
        fs.unlinkSync(file); // Delete the PDF file after it's downloaded
      });
    });
  });

  
router.get('/resumes/:id', reqauth, (req, res) => {
    const id = req.params.id;
    Resume.findByPk(id)
        .then((result) => {
            res.render('details', { resume: result, title: 'Resumes Details' })
            // res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
})

router.delete('/resumes/:id', reqauth, checkuser, (req, res) => {
    const id = req.params.id;
    Resume.destroy({
        where: {
            id: id
        }
    })
        .then((result) => {
            res.json({ redirect: '/resumes' })
        })
        .catch((err) => {
            console.log(err)
        });
});

router.get('/resumes', (req, res) => {
    Resume.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
        .then((result) => {
            res.render('index', { title: 'All-resumes', resumes: result })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post('/resumes', reqauth, (req, res) => {
    // const resume = new Resume(req.body);
    try {
        // const skillString = "HTML/CSS/JavaScript;Intermediate,React;Intermediate,Node.js;Beginner";
        const skillString = req.body.skills;
        const skillsArray = skillString.split(',');
        const skills = skillsArray.map(skill => {
            const [name, level] = skill.split(';');
            return { name, level };
        });

        const educationString = req.body.education;
        const educationsArray = educationString.split(',');
        const educations = educationsArray.map(education => {
            const [degree, school, location] = education.split(';');
            return { degree, school, location };
        });

        const experienceString = req.body.experience;
        const experiencesArray = experienceString.split(',');
        const experiences = experiencesArray.map(experience => {
            const [company, position, desc] = experience.split(';');
            return { company, position, desc };
        });

        jwt.verify(req.cookies.LoggedUser, 'secretlogin', async (err, result) => {
            console.log(req.body)
            const data = await Resume.create({
                userId: result.id,
                name: req.body.Name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                education: educations,
                experience: experiences,
                skills: skills,
            })
            res.status(201).send(data)
            // .then((result)=>{
            //     res.redirect('/resumes');
            // })
            // .catch((err)=>{
            //     console.log(err);
            // })
        })
    } catch (err) {
        console.log(err);
    }

});

module.exports = router;
