// ========== 地球组件脚本 - 使用 IIFE 避免全局污染 ==========
(function() {
    'use strict';
    
    // 检查依赖
    if (typeof Globe === 'undefined' || typeof topojson === 'undefined') {
        console.error('[DualEarth] Missing dependencies: globe.gl or topojson-client');
        return;
    }
    
    // ========== 配置数据 ==========
    const CONFIG = {
        COORD_MAP: {
            'CN': [35.8617, 104.1954], 'HK': [22.3193, 114.1694], 'TW': [23.6978, 120.9605],
            'MO': [22.1987, 113.5439], 'JP': [36.2048, 138.2529], 'KR': [35.9078, 127.7669],
            'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'GB': [55.3781, -3.4360],
            'DE': [51.1657, 10.4515], 'FR': [46.2276, 2.2137], 'IT': [41.8719, 12.5674],
            'ES': [40.4637, -3.7492], 'AU': [-25.2744, 133.7751], 'BR': [-14.2350, -51.9253],
            'RU': [61.5240, 105.3188], 'IN': [20.5937, 78.9629], 'SG': [1.3521, 103.8198],
            'TH': [15.8700, 100.9925], 'VN': [14.0583, 108.2772], 'MY': [4.2105, 101.9758],
            'ID': [-0.7893, 113.9213], 'PH': [12.8797, 121.7740], 'NL': [52.1326, 5.2913],
            'BE': [50.5039, 4.4699], 'CH': [46.8182, 8.2275], 'SE': [60.1282, 18.6435],
            'NO': [60.4720, 8.4689], 'FI': [61.9241, 25.7482], 'PL': [51.9194, 19.1451], 
            'MX': [23.6345, -102.5528], 'AR': [-38.4161, -63.6167], 'ZA': [-30.5595, 22.9375], 
            'EG': [26.8206, 30.8025], 'AQ': [-82.8628, 0.0000], 'GL': [71.7069, -42.6043]  // 芬兰和格陵兰
        },
        
        ISO_TO_ID: {
            'CN': '156', 'JP': '392', 'KR': '410', 'US': '840', 'CA': '124',
            'GB': '826', 'FR': '250', 'DE': '276', 'IT': '380', 'ES': '724',
            'AU': '36', 'BR': '76', 'RU': '643', 'IN': '356', 'HK': '344',
            'TW': '158', 'MO': '446', 'SG': '702', 'TH': '764', 'VN': '704',
            'MY': '458', 'ID': '360', 'PH': '608', 'NL': '528', 'BE': '56',
            'CH': '756', 'SE': '752', 'NO': '578', 'FI': '246', 'PL': '616', 
            'MX': '484', 'AR': '32', 'ZA': '710', 'EG': '818', 'AQ': '010', 
            'GL': '304'  // 芬兰和格陵兰
        },

        FLAG_EMOJI: {
            'CN': '🇨🇳', 'HK': '🇭🇰', 'MO': '🇲🇴', 'TW': '🇹🇼', 'JP': '🇯🇵', 
            'KR': '🇰🇷', 'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪',
            'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'AU': '🇦🇺', 'BR': '🇧🇷',
            'RU': '🇷🇺', 'IN': '🇮🇳', 'SG': '🇸🇬', 'TH': '🇹🇭', 'VN': '🇻🇳',
            'MY': '🇲🇾', 'ID': '🇮🇩', 'PH': '🇵🇭', 'NL': '🇳🇱', 'BE': '🇧🇪',
            'CH': '🇨🇭', 'SE': '🇸🇪', 'NO': '🇳🇴', 'FI': '🇫🇮', 'PL': '🇵🇱', 
            'MX': '🇲🇽', 'AR': '🇦🇷', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'AQ': '🇦🇶', 
            'GL': '🇬🇱'  // 芬兰和格陵兰
        }
    };

    // ========== DOM 元素 ==========
    const container = document.getElementById('dual-earth-container');
    const renderArea = document.getElementById('dual-earth-render-area');
    const toggleBtn = document.getElementById('dual-earth-toggle-btn');
    const closeBtn = document.querySelector('.de-close-btn');
    const modeBtns = document.querySelectorAll('.de-mode-btn');

    if (!container || !renderArea || !toggleBtn) {
        console.error('[DualEarth] Required DOM elements not found');
        return;
    }

    // ========== 状态管理 ==========
    let globeInstance = null;
    let isActive = false;
    let currentMode = 'realistic';
    let geoJSON = null;
    let emojiSupported = null;

    // ========== 工具函数 ==========
    function checkEmojiSupport() {
        if (emojiSupported !== null) return emojiSupported;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 32; 
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.font = '28px serif';
            ctx.fillText('🇨🇳', 0, 28);
            const data = ctx.getImageData(0, 0, 32, 32).data;
            let colors = new Set();
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 50) colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);
            }
            emojiSupported = colors.size > 3;
        } catch (e) { 
            emojiSupported = false; 
        }
        return emojiSupported;
    }

    function getFlagHTML(code) {
        if (checkEmojiSupport() && CONFIG.FLAG_EMOJI[code]) {
            return `<span class="de-flag-emoji">${CONFIG.FLAG_EMOJI[code]}</span>`;
        }
        return `<img class="de-flag-img" src="https://flagcdn.com/w40/${code.toLowerCase()}.png" alt="${code}" onerror="this.outerHTML='🏁'"/>`;
    }

    async function loadGeoJSON() {
        if (geoJSON) return geoJSON;
        try {
            const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            const topo = await res.json();
            geoJSON = topojson.feature(topo, topo.objects.countries).features;
            return geoJSON;
        } catch (e) {
            console.error('[DualEarth] Failed to load GeoJSON:', e);
            return [];
        }
    }

    function scanFlags() {
        const flags = new Set();
        
        document.querySelectorAll('[class*="flag-icon-"], [class*="fi-"]').forEach(el => {
            el.classList.forEach(cls => {
                const m = cls.match(/(?:flag-icon-|fi-)([a-z]{2})/i);
                if (m && CONFIG.COORD_MAP[m[1].toUpperCase()]) {
                    flags.add(m[1].toUpperCase());
                }
            });
        });
        
        document.querySelectorAll('[data-country-code], [data-country]').forEach(el => {
            const code = (el.dataset.countryCode || el.dataset.country || '').toUpperCase();
            if (CONFIG.COORD_MAP[code]) flags.add(code);
        });
        
        // 检测南极洲相关的class或属性
        document.querySelectorAll('[class*="antarctica"], [data-region*="antarctica"]').forEach(el => {
            flags.add('AQ');
        });
        
        if (flags.size === 0) {
            return ['CN', 'US', 'GB', 'JP', 'DE', 'FR', 'AU', 'CA'];
        }
        
        return Array.from(flags);
    }

    function generateGridTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 0.4;
        
        const numLongitudes = 144;
        for (let i = 0; i <= numLongitudes; i++) {
            const x = (i / numLongitudes) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        const numLatitudes = 72;
        for (let i = 0; i <= numLatitudes; i++) {
            const y = (i / numLatitudes) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        return canvas.toDataURL();
    }

    function filterPolygons(codes) {
        if (!geoJSON || codes.length === 0) return [];
        
        const result = [];
        codes.forEach(code => {
            const numericId = CONFIG.ISO_TO_ID[code];
            const feat = geoJSON.find(f => {
                const fid = String(f.id);
                const props = f.properties || {};
                return (numericId && (fid === numericId || fid === numericId.padStart(3, '0'))) ||
                       props.ISO_A2 === code || props.iso_a2 === code;
            });
            if (feat) result.push({ code, geometry: feat.geometry, id: feat.id });
        });
        return result;
    }

    function generateData() {
        const codes = scanFlags();
        const points = [], arcs = [];
        if (codes.length === 0) return { points, arcs, codes };

        const centerCode = codes.includes('CN') ? 'CN' : codes[0];
        const centerCoord = CONFIG.COORD_MAP[centerCode];

        codes.forEach(code => {
            const coord = CONFIG.COORD_MAP[code];
            if (coord) {
                points.push({ code, lat: coord[0], lng: coord[1] });
                if (code !== centerCode && currentMode === 'realistic') {
                    arcs.push({
                        startLat: centerCoord[0], 
                        startLng: centerCoord[1],
                        endLat: coord[0], 
                        endLng: coord[1]
                    });
                }
            }
        });

        // 3D模式：生成所有连接
        if (currentMode === 'grid') {
            for (let i = 0; i < codes.length; i++) {
                for (let j = i + 1; j < codes.length; j++) {
                    const coord1 = CONFIG.COORD_MAP[codes[i]];
                    const coord2 = CONFIG.COORD_MAP[codes[j]];
                    
                    if (coord1 && coord2) {
                        arcs.push({
                            startLat: coord1[0],
                            startLng: coord1[1],
                            endLat: coord2[0],
                            endLng: coord2[1]
                        });
                    }
                }
            }
        }

        return { points, arcs, codes };
    }

    // ========== 写实模式 ==========
    function setupRealisticMode(globe, points, arcs, polygons) {
        globe.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');
        globe.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg');
        globe.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');
        globe.atmosphereColor('rgba(26, 84, 144, 0.8)');
        globe.atmosphereAltitude(0.25);

        if (polygons.length > 0) {
            globe.polygonsData(polygons);
            globe.polygonAltitude(0.01);
            globe.polygonCapColor(() => 'rgba(0, 200, 255, 0.4)');
            globe.polygonSideColor(() => 'rgba(0, 200, 255, 0.2)');
            globe.polygonStrokeColor(() => '#00ffff');

            globe.onPolygonHover((polygon) => {
                if (polygon) {
                    globe.controls().autoRotate = false;
                } else {
                    globe.controls().autoRotate = true;
                }
                
                globe.polygonAltitude(d => d === polygon ? 0.06 : 0.01);
                globe.polygonCapColor(d => d === polygon ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 200, 255, 0.4)');
                globe.polygonSideColor(d => d === polygon ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 200, 255, 0.15)');
            });

            globe.polygonLabel(d => {
                return `<div class="de-earth-label-card">
                    <div class="de-flag-display">${getFlagHTML(d.code)}</div>
                    <b>${d.code}</b>
                </div>`;
            });
        }

        globe.ringsData(points);
        globe.ringColor(() => '#00ffff');
        globe.ringMaxRadius(5);
        globe.ringPropagationSpeed(3);
        globe.ringRepeatPeriod(800);

        globe.pointsData(points);
        globe.pointColor(() => '#00ffff');
        globe.pointAltitude(0.02);
        globe.pointRadius(0.5);

        globe.htmlElementsData(points);
        globe.htmlElement(d => {
            const el = document.createElement('div');
            el.innerHTML = `<div class="de-earth-label-card">
                <div class="de-flag-display">${getFlagHTML(d.code)}</div>
                <b>${d.code}</b>
            </div>`;
            el.style.pointerEvents = 'none';
            return el;
        });
        globe.htmlLat(d => d.lat);
        globe.htmlLng(d => d.lng);
        globe.htmlAltitude(0.06);

        globe.arcsData(arcs);
        globe.arcColor(() => ['rgba(0, 255, 255, 0.5)', 'rgba(255, 0, 255, 0.5)']);
        globe.arcDashLength(0.7);
        globe.arcDashGap(0.2);
        globe.arcDashAnimateTime(2000);
        globe.arcStroke(1.2);
        globe.arcAltitude(0.3);
    }

    // ========== 3D模式 ==========
    function setupGridMode(globe, points, arcs, polygons, allPolygons) {
        const gridTexture = generateGridTexture();
        globe.globeImageUrl(gridTexture);
        globe.bumpImageUrl(null);
        globe.backgroundImageUrl(null);
        globe.backgroundColor('#000000');
        globe.atmosphereColor('rgba(0, 240, 255, 0.15)');
        globe.atmosphereAltitude(0.15);

        globe.onGlobeReady(() => {
            const globeMaterial = globe.scene().children.find(obj => 
                obj.type === 'Mesh' && obj.geometry.type.includes('Sphere')
            );
            if (globeMaterial) {
                globeMaterial.material.transparent = true;
                globeMaterial.material.opacity = 0.1;
            }
        });

        globe.polygonsData(allPolygons);
        globe.polygonAltitude(d => d.isActive ? 0.015 : 0.01);
        globe.polygonCapColor(d => d.isActive ? 'rgba(0, 60, 80, 0.9)' : 'rgba(0, 0, 0, 0)');
        // 点亮的国家使用明亮的青色发光边界线，未点亮的使用白色边界线（更亮）
        globe.polygonStrokeColor(d => d.isActive ? '#00ffff' : 'rgba(255, 255, 255, 0.7)');
        globe.polygonSideColor(d => d.isActive ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0,0,0,0)');
        globe.onPolygonHover(null);
        globe.polygonLabel(() => null);

        globe.ringsData([]);
        globe.htmlElementsData([]);

        globe.pointsData(points);
        globe.pointColor(() => '#00ffff');
        globe.pointAltitude(0.025);
        globe.pointRadius(0.5);

        globe.arcsData(arcs);
        globe.arcColor(() => ['rgba(0, 255, 255, 0.7)', 'rgba(41, 255, 198, 0.7)']);
        globe.arcDashLength(0.15);
        globe.arcDashGap(0.08);
        globe.arcDashAnimateTime(3000);
        globe.arcStroke(0.25);
        globe.arcAltitude(0.3);
    }

    // ========== 初始化地球 ==========
    async function initGlobe() {
        if (globeInstance) {
            switchMode(currentMode);
            return;
        }
        
        checkEmojiSupport();
        await loadGeoJSON();
        
        const { points, arcs, codes } = generateData();
        
        if (codes.length === 0) {
            console.log('[DualEarth] No data found');
            return;
        }

        const polygons = filterPolygons(codes);
        const allPolygons = geoJSON.map(feat => {
            const isActive = polygons.some(p => p.id === feat.id);
            return {
                id: feat.id,
                geometry: feat.geometry,
                isActive: isActive
            };
        });

        const globe = Globe();
        globe(renderArea);
        globe.width(renderArea.clientWidth);
        globe.height(renderArea.clientHeight);

        if (currentMode === 'realistic') {
            setupRealisticMode(globe, points, arcs, polygons);
        } else {
            setupGridMode(globe, points, arcs, polygons, allPolygons);
        }

        globe.pointOfView({
            lat: codes.includes('CN') ? 35 : 20,
            lng: codes.includes('CN') ? 110 : 0,
            altitude: 2.5
        });

        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.8;
        globe.controls().enableZoom = true;

        globeInstance = globe;
    }

    // ========== 切换模式 ==========
    function switchMode(mode) {
        if (!globeInstance) return;
        
        currentMode = mode;
        const { points, arcs, codes } = generateData();
        const polygons = filterPolygons(codes);
        const allPolygons = geoJSON.map(feat => {
            const isActive = polygons.some(p => p.id === feat.id);
            return {
                id: feat.id,
                geometry: feat.geometry,
                isActive: isActive
            };
        });

        if (mode === 'realistic') {
            setupRealisticMode(globeInstance, points, arcs, polygons);
        } else {
            setupGridMode(globeInstance, points, arcs, polygons, allPolygons);
        }
    }

    // ========== 事件监听 ==========
    toggleBtn.addEventListener('click', () => {
        isActive = true;
        container.classList.add('de-active');
        toggleBtn.classList.add('de-hidden');
        setTimeout(initGlobe, 200);
    });

    closeBtn.addEventListener('click', () => {
        isActive = false;
        container.classList.remove('de-active');
        toggleBtn.classList.remove('de-hidden');
        if (globeInstance && globeInstance.controls) {
            globeInstance.controls().autoRotate = false;
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            if (mode === currentMode) return;
            
            modeBtns.forEach(b => b.classList.remove('de-active'));
            btn.classList.add('de-active');
            
            switchMode(mode);
        });
    });

    window.addEventListener('resize', () => {
        if (isActive && globeInstance) {
            globeInstance.width(renderArea.clientWidth);
            globeInstance.height(renderArea.clientHeight);
        }
    });

    console.log('[DualEarth] Component loaded successfully');
})();
