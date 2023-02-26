const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then(genres => res.render("moviesAdd",{
            genres
        })).catch(error => console.log(error))
   },
   create: function (req, res) {
       db.Movie.create({
           ...req.body
       }).then(movie => {
           console.log(movie)
           res.redirect('/movies')
   }).catch(error => console.log(error))
   },
   edit: function(req, res) {   
       let genres = db.Genre.findAll()
       let Movie = db.Movie.findByPk(req.params.id)
       Promise.all([genres, Movie])
       .then(([genres, Movie]) => res.render('moviesEdit.ejs', {Movie, genres}))
       .catch(error => console.log(error))
   },
   update: function (req,res) {
       db.Movie.update({
           ...req.body
       },
       {
           where:{id : req.params.id}
       })
       .then(result => {console.log(result)
           return res.redirect('/movies')
       })
       .catch(error => console.log(error))
   },
   delete: function (req, res){
       db.Movie.findByPk(req.params.id)
       .then(Movie => {res.render('moviesDelete', {Movie}) })
   },
   destroy: function (req, res) {
       db.Movie.destroy({
           where :{
               id: req.params.id
           }
       })
       .then(result => {
           console.log(result)
           return res.redirect('/movies')
       }) 
       .catch(error => console.log(error))
   }
}

module.exports = moviesController;