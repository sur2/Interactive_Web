export class Point {
    constructor(index, x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.1;
        this.cur = index;
        this.max = Math.random() * 100 + 150; // 움직임 최대값
    }

    update() {
        this.cur += this.speed;
        this.y = this.fixedY + (Math.sin(this.cur) * this.max); // 사인파 수직이동에 최근값 사용, 사인파 폭이 max에 비례
    }
}