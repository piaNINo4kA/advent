const gulp = require('gulp'),
		concat = require('gulp-concat'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS = require('gulp-clean-css'),
		uglify = require('gulp-uglify'),
		del = require('del'),
		browserSync = require('browser-sync').create(),
		pug = require('gulp-pug'),
		sass = require('gulp-sass')(require('sass'))
		imagemin = require('gulp-imagemin'),
		babel = require('gulp-babel');
const fs = require('fs');

const cssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/css/style.sass',
	'./src/css/media.sass'
];

const jsFiles = [
	'./src/js/*.js'
];

const libs = [
'./node_modules/parallax-js/dist/parallax.min.js',
'./node_modules/jquery/dist/jquery.min.js',
'./node_modules/wowjs/dist/wow.min.js'
];

const img = [
'./src/img/*'
];

const fonts = [ 
 './fonts/*',
];

function parseInputData(dataString) {
	return dataString.split("\n") 
      .map(item => { 
        const arr = item.split("\t"); 
        return { 
          "day": arr[0], 
          "type": arr[1], 
          "title": arr[2], 
          "link": arr[3], 
          "promocode": arr[4], 
          "backTitle": arr[5], 
          "list": arr[6], 
          "terms": arr[7], 
          "gamePic": arr[8]         
        } 
      })
}

function readDataJSON() {
	const dataString = fs.readFileSync("src/data.txt").toString();
	return parseInputData(dataString);
}

function Html() {
	const dataJSON = readDataJSON()
	return gulp.src('./src/*.pug')
				.pipe(pug({
					locals: {
						dataJSON,
					},
					pretty: true
				}))
				.pipe(gulp.dest('./build'))
				.pipe(browserSync.stream());
}


function Styles() {
	return gulp.src(cssFiles)
				.pipe(sass.sync().on('error', sass.logError))
				.pipe(concat('all_style.css'))
				.pipe(autoprefixer({
            		cascade: false
       			}))
       			.pipe(cleanCSS({
       				level: 0
       			}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}


function Script() {
	const filePath = 'src/js/yyypr.js'
	const dataJSON = readDataJSON()
	const data = "var promocodes = " + JSON.stringify(dataJSON.map(item => item.promocode));
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
	fs.writeFileSync(filePath, data);
	return gulp.src(jsFiles)
				.pipe(concat('all_js.js'))
				.pipe(babel({
            		presets: ['@babel/env']
        		}))
				// .pipe(uglify({
				// 	toplevel: true
				// }))
				.pipe(gulp.dest('./build/js'))
				.pipe(browserSync.stream());
}

function Libs() {
	return gulp.src(libs)
				.pipe(concat('all_libs.js'))
				.pipe(gulp.dest('./build/js'))
				.pipe(browserSync.stream());
}


function ImgMIn() {
	return gulp.src(img)
				// .pipe(imagemin())
				.pipe(gulp.dest('./build/img'))
				.pipe(browserSync.stream());
}


function Fonts() { 
	return gulp.src(fonts)  
		.pipe(gulp.dest('./build/fonts')) 
		.pipe(browserSync.stream()); 
}


function Watch() {
	 browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
	gulp.watch('./src/**/*.pug', Html);
	gulp.watch('./src/css/**/*.sass', Styles);
	gulp.watch('./src/js/**/*.js', Script);
	gulp.watch('./src/img/**/*', ImgMIn);
	gulp.watch('./src/fonts/*', Fonts);

}

function Clean() {
	return del(['build/*', 'prod/*']);
}

// region build pug + styles + js

// directory with general-page pug file
const pages_dir = './src/_pages/';
// directory where to put result of pug compilation
const pug_result_dir = './prod/';

// process general-page.pug file from ./src/_pages/ folder
function processPagesPug() {
	const dataJSON = readDataJSON()
	return gulp.src(pages_dir + '*.pug')
				.pipe(pug({
					locals: {
						dataJSON,
					},
					pretty: true,
				}))
				.pipe(gulp.dest(pug_result_dir));
}

gulp.task('processPagesPug', processPagesPug);
// end build pug + styles + js

gulp.task('Html', Html);
gulp.task('Fonts', Fonts);
gulp.task('Styles', Styles);
gulp.task('Script', Script);
gulp.task('ImgMIn', ImgMIn);
gulp.task('Libs', Libs);
gulp.task('Watch', Watch);

gulp.task('build', gulp.series(Clean, 
							gulp.parallel(Styles, Script, ImgMIn, Html, Fonts, Libs, ImgMIn))
						);
gulp.task('dev', gulp.series('build', Watch));
gulp.task('stage', gulp.series(Clean, Styles, Script, processPagesPug));