class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.waveGroup = new WaveGroup();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        // 애니메이션 시작
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        // 캔버스를 더블 사이즈로 지정해서 레티나 디스플레이에서도 잘 보이도록 함
        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2);

        this.waveGroup.resize(this.stageWidth, this.stageHeight);
    }

    animate(t) {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.waveGroup.draw(this.ctx);

        requestAnimationFrame(this.animate.bind(this));
    }
}

class WaveGroup {
    constructor() {
        this.totalWaves = 3;
        this.totalPoints = 6;

        this.color = ['rgba(255, 0, 180, 0.4)', 'rgba(188, 255, 0, 0.4)', 'rgba(0, 190, 255, 0.4)'];;
        this.waves = [];

        for (let i = 0; i < this.totalWaves; i++) {
            const wave = new Wave(
                i,
                this.totalPoints,
                this.color[i],
            );
            this.waves[i] = wave;
        }
    }
    resize(stageWidth, stageHeight) {
        for (let i = 0; i < this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.resize(stageWidth, stageHeight);
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.draw(ctx);
        }
    }
}

class Wave {
    // wave 고유 인덱스에 따라 차이(갭)를 두어 웨이브 표현
    constructor(index, totalPoints, color) {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        // 화면의 중앙에 그려지기 때문에 스테이지의 절반을 좌표 지정
        this.centerX = stageWidth / 2;
        this.centerY = stageHeight / 2;

        this.pointGap = this.stageWidth / (this.totalPoints - 1);

        this.init();
    }

    init() {
        // this.point = new Point(this.centerX, this.centerY);
        // 정해진 간격만큼 포인트를 그림
        this.points = [];
        for (let i = 0; i < this.totalPoints; i++) {
            const point = new Point(this.index + i, this.pointGap * i, this.centerY);
            this.points[i] = point;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        // 처음과 마지막 포인트는 고정
        let prevX = this.points[0].x;
        let prevY = this.points[0].y;

        ctx.moveTo(prevX, prevY);

        for (let i = 1; i < this.totalPoints; i++) {
            if (i < this.totalPoints - 1) {
                this.points[i].update();
            }

            const cx = (prevX + this.points[i].x) / 2;
            const cy = (prevY + this.points[i].y) / 2;

            // 곡선 그리기
            ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            prevX = this.points[i].x;
            prevY = this.points[i].y;
        }

        // 현재 포인트와 이전 포인트의 중간값을 곡선의 공통된 포인트로 잡는다. 연속해서 직선을 그리면 부드러운 곡선으로 표현가능
        ctx.lineTo(prevX, prevY);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();
        ctx.closePath();

        // this.point.update();

        // ctx.arc(this.point.x, this.point.y, 30, 0, 2 * Math.PI);
        // ctx.fill();
    }
}

class Point {
    constructor(index, x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.05;
        this.cur = index;
        this.max = Math.random() * 100 + 50; // 움직임 최대값
    }

    update() {
        this.cur += this.speed;
        this.y = this.fixedY + (Math.sin(this.cur) * this.max); // 사인파 수직이동에 최근값 사용, 사인파 폭이 max에 비례
    }
}

window.onload = () => {
    new App();
};