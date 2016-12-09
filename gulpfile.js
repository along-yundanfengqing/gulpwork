
var del=require('del');
var gulp=require('gulp');
var uglify=require('gulp-uglify');
var imagemin=require('gulp-imagemin');
var mincss=require('gulp-clean-css');//压缩css
var inline=require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include=require('gulp-include'); //资源内联（主要是html片段）
var sequence=require('gulp-sequence');
var useref=require('gulp-useref'); //合并文件
var gulpif=require('gulp-if');
var print=require('gulp-print'); //打印命中的文件
var connect=require('gulp-connect'); //本地服务器
var jshint=require('gulp-jshint'); //js 代码校验
var spritesmith=require('gulp.spritesmith');

//清理构建目录
gulp.task('clean',function (cb) {
    del(['dist']).then(function () {
        cb();
    })
});



gulp.task('mincss',function () {
    return gulp.src('./src/css/*.css')
        .pipe(mincss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('minimg', function () {
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});


gulp.task('minjs',function () {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});


gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(inline())//把js内联到html中
        .pipe(include())//把html片段内联到html主文件中
        .pipe(useref())//根据标记的块  合并js或者css
        .pipe(gulpif('*.js',uglify()))
        .pipe(gulpif('*.css',mincss()))
        .pipe(connect.reload()) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist'));
});

//雪碧图压缩
gulp.task('spriter', function() {
    var spriteData=gulp.src('./src/img/login/*.png').pipe(
    	spritesmith({
    		imgName:'login_sprite.png',
    		cssName:'login_sprite.css'
    	}));
    return spriteData.pipe(gulp.dest('./dist/css'));



});


// 检查js
gulp.task('hint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//本地服务器  支持自动刷新页面
gulp.task('connect', function() {
    connect.server({
        root: './dist', //本地服务器的根目录路径
        port:8080,
        livereload: true
    });
});

//sequence的返回函数只能运行一次 所以这里用function cb方式使用
gulp.task('watchlist',function (cb) {
    sequence('clean',['mincss','minimg','spriter','minjs','html'])(cb)
});

gulp.task('watch',function () {
    gulp.watch(['./src/**'],['watchlist']);
});


//中括号外面的是串行执行， 中括号里面的任务是并行执行。
gulp.task('default',function (cb) {
    sequence('clean',['mincss','minimg','spriter','minjs','html','connect'],'watch')(cb)
});



