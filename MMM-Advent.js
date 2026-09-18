Module.register("MMM-Advent", {
    defaults: {
        theme: "minimal-glow", // "minimal-glow" | "ornate-holiday"
        start: null, // null = auto: Dec 1, current year, 00:00:00
        end: null, // null = auto: Dec 24, current year, 23:59:59
        marks: 24,
        showMarkNumbers: true,
        showDaysBadge: true, // ornate-holiday theme only
        height: 425,
        showFlameBeforeStart: false,
        enableAnimation: true,
        updateInterval: 10 * 60 * 1000
    },

    start() {
        Log.info("Starting module: " + this.name);

        if (this.config.updateInterval < 10 * 1000) {
            this.config.updateInterval = 10 * 1000;
        }

        setInterval(() => {
            this.updateDom();
        }, this.config.updateInterval);
    },

    getStyles() {
        return ["MMM-Advent.css", "custom.css"];
    },

    resolveDates(now) {
        const year = now.getFullYear();
        const start = this.config.start ? new Date(this.config.start) : new Date(year, 11, 1, 0, 0, 0);
        const end = this.config.end ? new Date(this.config.end) : new Date(year, 11, 24, 23, 59, 59);
        return { start, end };
    },

    computeOffset(now, start, end) {
        const total = end.getTime() - start.getTime();
        let offset = (now.getTime() - start.getTime()) / total;
        if (offset >= 1.0) {
            offset = 1.0;
        }
        if (offset <= -0.01) {
            offset = -0.01;
        }
        return offset;
    },

    daysRemaining(now, end) {
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / msPerDay));
    },

    renderTickMarks(height, candleStart, candleEnd, color) {
        if (!this.config.marks || this.config.marks < 1) {
            return "";
        }
        const denom = this.config.marks > 1 ? this.config.marks - 1 : 1;
        let markup = "";
        for (let i = 0; i < this.config.marks; i++) {
            const y = candleStart + (i / denom) * (height - (candleStart + candleEnd));
            markup += `<line x1="20" y1="${y}" x2="80" y2="${y}" stroke="${color}" stroke-width="1" opacity="0.35"/>`;
            if (this.config.showMarkNumbers) {
                markup += `<text x="45" y="${y - 4}" font-size="10" text-anchor="middle" class="mark-label">${i + 1}</text>`;
            }
        }
        return markup;
    },

    renderMinimalGlow(offset, showFlame) {
        const height = this.config.height;
        const candleTopSpace = 60;
        const candleStart = 62;
        const candleEnd = 12;
        const flameSpace = 35;
        const topInset = candleTopSpace + Math.round(offset * (height - candleTopSpace));

        const marks = this.renderTickMarks(height, candleStart, candleEnd, "#000000");

        const flame = showFlame
            ? `<g style="transform: translateY(${topInset - flameSpace}px)">
                   <g class="flame-group">
                       <ellipse cx="45" cy="0" rx="30" ry="30" fill="url(#mg-glow)"/>
                       <path d="M45 -22 C 51 -8, 56 0, 45 20 C 34 0, 39 -8, 45 -22 Z" fill="#ffb347"/>
                       <path d="M45 -10 C 48 -2, 51 2, 45 14 C 39 2, 42 -2, 45 -10 Z" fill="#fff3d6"/>
                   </g>
               </g>`
            : "";

        return `<svg class="advent-svg" viewBox="0 0 90 ${height}" width="90" height="${height}">
            <defs>
                <linearGradient id="mg-wax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f5f0e6"/>
                    <stop offset="100%" stop-color="#d8cdb8"/>
                </linearGradient>
                <radialGradient id="mg-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffd27a" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#ffd27a" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect x="10" y="${topInset}" width="70" height="${height - topInset}" rx="10" fill="url(#mg-wax)"/>
            ${marks}
            ${flame}
        </svg>`;
    },

    renderOrnateHoliday(offset, showFlame, end, now) {
        const height = this.config.height;
        const candleTopSpace = 55;
        const candleStart = 70;
        const candleEnd = 15;
        const flameSpace = 40;
        const topInset = candleTopSpace + Math.round(offset * (height - candleTopSpace));

        const marks = this.renderTickMarks(height, candleStart, candleEnd, "#d4af37");

        const flame = showFlame
            ? `<g style="transform: translateY(${topInset - flameSpace}px)">
                   <g class="flame-group">
                       <ellipse cx="50" cy="0" rx="36" ry="36" fill="url(#oh-glow)"/>
                       <path d="M50 -25 C 58 -8, 62 0, 50 22 C 38 0, 42 -8, 50 -25 Z" fill="#ff9d2f"/>
                       <path d="M50 -12 C 53 -2, 55 2, 50 16 C 45 2, 47 -2, 50 -12 Z" fill="#fff7dc"/>
                   </g>
               </g>`
            : "";

        const badge = this.config.showDaysBadge
            ? `<g class="days-badge">
                   <circle cx="50" cy="${height - 30}" r="16" fill="#d4af37"/>
                   <text x="50" y="${height - 25}" font-size="13" text-anchor="middle" class="days-number">${this.daysRemaining(now, end)}</text>
               </g>`
            : "";

        return `<svg class="advent-svg" viewBox="0 0 100 ${height}" width="100" height="${height}">
            <defs>
                <radialGradient id="oh-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffcf6b" stop-opacity="1"/>
                    <stop offset="100%" stop-color="#ff8a00" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect x="15" y="${topInset}" width="70" height="${height - topInset}" rx="4" fill="#8c1a1a" stroke="#d4af37" stroke-width="2"/>
            ${marks}
            <path d="M25 ${height - 55} q 25 -10 50 0" stroke="#2e7d32" stroke-width="4" fill="none"/>
            <circle cx="35" cy="${height - 57}" r="3" fill="#d4af37"/>
            <circle cx="50" cy="${height - 63}" r="3" fill="#d4af37"/>
            <circle cx="65" cy="${height - 57}" r="3" fill="#d4af37"/>
            ${badge}
            ${flame}
        </svg>`;
    },

    getDom() {
        const now = new Date();
        const { start, end } = this.resolveDates(now);
        const offset = this.computeOffset(now, start, end);
        const showFlame = this.config.showFlameBeforeStart || offset >= 0.0;

        const wrapper = document.createElement("div");
        wrapper.className = "theme-" + this.config.theme + (this.config.enableAnimation ? "" : " no-animation");

        wrapper.innerHTML =
            this.config.theme === "ornate-holiday"
                ? this.renderOrnateHoliday(offset, showFlame, end, now)
                : this.renderMinimalGlow(offset, showFlame);

        return wrapper;
    }
});
