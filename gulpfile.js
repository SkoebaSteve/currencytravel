var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});


// start our server and listen for changes
// gulp.task('default', function() {
//     // configure nodemon
//     nodemon({
//         // the script to run the app
//         script: 'server.js',
//         // this listens to changes in any of these files/routes and restarts the application
//         watch: ["server.js", "app.js", "routes/", 'public/*', 'public/*/**'],
//         ext: 'js'
//         // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
//     }).on('restart', function() {
//     gulp.src('server.js')
//       // I've added notify, which displays a message on restart. Was more for me to test so you can remove this
//       .pipe(notify('Running the start tasks and stuff'));
//   });
// });