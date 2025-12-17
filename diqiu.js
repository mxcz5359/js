(function() {
    'use strict';
    
    // === 1. 数据常量 ===
    const COORD_MAP = {
        'CN': [35.8617, 104.1954], 'HK': [22.3193, 114.1694], 'TW': [23.6978, 120.9605],
        'MO': [22.1987, 113.5439], 'JP': [36.2048, 138.2529], 'KR': [35.9078, 127.7669],
        'KP': [40.3399, 127.5101], 'SG': [1.3521, 103.8198], 'TH': [15.8700, 100.9925],
        'VN': [14.0583, 108.2772], 'MY': [4.2105, 101.9758], 'ID': [-0.7893, 113.9213],
        'PH': [12.8797, 121.7740], 'IN': [20.5937, 78.9629], 'PK': [30.3753, 69.3451],
        'BD': [23.6850, 90.3563], 'MM': [21.9162, 95.9560], 'KH': [12.5657, 104.9910],
        'LA': [19.8563, 102.4955], 'NP': [28.3949, 84.1240], 'LK': [7.8731, 80.7718],
        'BT': [27.5142, 90.4336], 'MN': [46.8625, 103.8467], 'KZ': [48.0196, 66.9237],
        'UZ': [41.3775, 64.5853], 'TM': [38.9697, 59.5563], 'KG': [41.2044, 74.7661],
        'TJ': [38.8610, 71.2761], 'AZ': [40.1431, 47.5769], 'GE': [42.3154, 43.3569],
        'AM': [40.0691, 45.0382], 'KW': [29.3117, 47.4818], 'QA': [25.3548, 51.1839],
        'BH': [26.0667, 50.5577], 'OM': [21.4735, 55.9754], 'JO': [30.5852, 36.2384],
        'LB': [33.8547, 35.8623], 'IQ': [33.2232, 43.6793], 'IR': [32.4279, 53.6880],
        'AF': [33.9391, 67.7100], 'SY': [34.8021, 38.9968], 'YE': [15.5527, 48.5164],
        'TR': [38.9637, 35.2433], 'AE': [23.4241, 53.8478], 'SA': [23.8859, 45.0792],
        'IL': [31.0461, 34.8516],
        'GB': [55.3781, -3.4360], 'DE': [51.1657, 10.4515], 'FR': [46.2276, 2.2137],
        'IT': [41.8719, 12.5674], 'ES': [40.4637, -3.7492], 'NL': [52.1326, 5.2913],
        'BE': [50.5039, 4.4699], 'CH': [46.8182, 8.2275], 'AT': [47.5162, 14.5501],
        'SE': [60.1282, 18.6435], 'NO': [60.4720, 8.4689], 'FI': [61.9241, 25.7482],
        'DK': [56.2639, 9.5018], 'IE': [53.4129, -8.2439], 'PT': [39.3999, -8.2245],
        'GR': [39.0742, 21.8243], 'PL': [51.9194, 19.1451], 'CZ': [49.8175, 15.4730],
        'RO': [45.9432, 24.9668], 'HU': [47.1625, 19.5033], 'UA': [48.3794, 31.1656],
        'RU': [61.5240, 105.3188], 'SK': [48.6690, 19.6990], 'BG': [42.7339, 25.4858],
        'HR': [45.1000, 15.2000], 'RS': [44.0165, 21.0059], 'SI': [46.1512, 14.9955],
        'LT': [55.1694, 23.8813], 'LV': [56.8796, 24.6032], 'EE': [58.5953, 25.0136],
        'BY': [53.7098, 27.9534], 'MD': [47.4116, 28.3699], 'IS': [64.9631, -19.0208],
        'LU': [49.8153, 6.1296], 'MT': [35.9375, 14.3754], 'CY': [35.1264, 33.4299],
        'AL': [41.1533, 20.1683], 'MK': [41.5124, 21.7465], 'BA': [43.9159, 17.6791],
        'ME': [42.7087, 19.3744],
        'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528],
        'GT': [15.7835, -90.2308], 'CU': [21.5218, -77.7812], 'HT': [18.9712, -72.2852],
        'DO': [18.7357, -70.1627], 'JM': [18.1096, -77.2975], 'PA': [8.5380, -80.7821],
        'CR': [9.7489, -83.7534], 'NI': [12.8654, -85.2072], 'HN': [15.2000, -86.2419],
        'SV': [13.7942, -88.8965], 'BZ': [17.1899, -88.4976],
        'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
        'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'VE': [6.4238, -66.5897],
        'EC': [-1.8312, -78.1834], 'BO': [-16.2902, -63.5887], 'PY': [-23.4425, -58.4438],
        'UY': [-32.5228, -55.7658], 'GY': [4.8604, -58.9302], 'SR': [3.9193, -56.0278],
        'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860], 'FJ': [-17.7134, 178.0650],
        'PG': [-6.3150, 143.9555], 'NC': [-20.9043, 165.6180],
        'ZA': [-30.5595, 22.9375], 'EG': [26.8206, 30.8025], 'NG': [9.0820, 8.6753],
        'KE': [-0.0236, 37.9062], 'MA': [31.7917, -7.0926], 'DZ': [28.0339, 1.6596],
        'TN': [33.8869, 9.5375], 'GH': [7.9465, -1.0232], 'ET': [9.1450, 40.4897],
        'TZ': [-6.3690, 34.8888], 'UG': [1.3733, 32.2903], 'CI': [7.5400, -5.5471],
        'SN': [14.4974, -14.4524], 'CM': [7.3697, 12.3547], 'AO': [-11.2027, 17.8739],
        'MZ': [-18.6657, 35.5296], 'MG': [-18.7669, 46.8691], 'ZW': [-19.0154, 29.1549],
        'BW': [-22.3285, 24.6849], 'NA': [-22.9576, 18.4904], 'RW': [-1.9403, 29.8739],
        'MU': [-20.3484, 57.5522], 'LY': [26.3351, 17.2283], 'SD': [12.8628, 30.2176],
        'AQ': [-82.8628, 135.0000]
    };

    // 中文名称映射
    const COUNTRY_NAME_CN = {
        'CN': '中国', 'HK': '香港', 'TW': '台湾', 'MO': '澳门', 'JP': '日本',
        'KR': '韩国', 'KP': '朝鲜', 'SG': '新加坡', 'MY': '马来西亚', 'TH': '泰国',
        'VN': '越南', 'PH': '菲律宾', 'ID': '印尼', 'IN': '印度', 'PK': '巴基斯坦',
        'BD': '孟加拉国', 'LK': '斯里兰卡', 'MM': '缅甸', 'KH': '柬埔寨', 'LA': '老挝',
        'NP': '尼泊尔', 'BT': '不丹', 'MN': '蒙古', 'KZ': '哈萨克斯坦', 'UZ': '乌兹别克斯坦',
        'TM': '土库曼斯坦', 'KG': '吉尔吉斯斯坦', 'TJ': '塔吉克斯坦', 'AF': '阿富汗',
        'AE': '阿联酋', 'SA': '沙特', 'IL': '以色列', 'JO': '约旦', 'LB': '黎巴嫩',
        'SY': '叙利亚', 'IQ': '伊拉克', 'IR': '伊朗', 'TR': '土耳其', 'YE': '也门',
        'OM': '阿曼', 'KW': '科威特', 'QA': '卡塔尔', 'BH': '巴林', 'AM': '亚美尼亚',
        'AZ': '阿塞拜疆', 'GE': '格鲁吉亚',
        'US': '美国', 'CA': '加拿大', 'MX': '墨西哥', 'GT': '危地马拉', 'BZ': '伯利兹',
        'SV': '萨尔瓦多', 'HN': '洪都拉斯', 'NI': '尼加拉瓜', 'CR': '哥斯达黎加',
        'PA': '巴拿马', 'CU': '古巴', 'JM': '牙买加', 'HT': '海地', 'DO': '多米尼加',
        'GB': '英国', 'IE': '爱尔兰', 'FR': '法国', 'DE': '德国', 'IT': '意大利',
        'ES': '西班牙', 'PT': '葡萄牙', 'NL': '荷兰', 'BE': '比利时', 'LU': '卢森堡',
        'CH': '瑞士', 'AT': '奥地利', 'SE': '瑞典', 'NO': '挪威', 'FI': '芬兰',
        'DK': '丹麦', 'IS': '冰岛', 'PL': '波兰', 'CZ': '捷克', 'SK': '斯洛伐克',
        'HU': '匈牙利', 'RO': '罗马尼亚', 'BG': '保加利亚', 'GR': '希腊', 'HR': '克罗地亚',
        'SI': '斯洛文尼亚', 'RS': '塞尔维亚', 'BA': '波黑', 'ME': '黑山', 'MK': '北马其顿',
        'AL': '阿尔巴尼亚', 'UA': '乌克兰', 'BY': '白俄罗斯', 'MD': '摩尔多瓦',
        'RU': '俄罗斯', 'EE': '爱沙尼亚', 'LV': '拉脱维亚', 'LT': '立陶宛',
        'CY': '塞浦路斯', 'MT': '马耳他',
        'BR': '巴西', 'AR': '阿根廷', 'CL': '智利', 'CO': '哥伦比亚', 'PE': '秘鲁',
        'VE': '委内瑞拉', 'EC': '厄瓜多尔', 'BO': '玻利维亚', 'PY': '巴拉圭',
        'UY': '乌拉圭', 'GY': '圭亚那', 'SR': '苏里南',
        'AU': '澳大利亚', 'NZ': '新西兰', 'FJ': '斐济', 'PG': '巴新', 'NC': '新喀里多尼亚',
        'ZA': '南非', 'EG': '埃及', 'NG': '尼日利亚', 'KE': '肯尼亚', 'ET': '埃塞俄比亚',
        'MA': '摩洛哥', 'DZ': '阿尔及利亚', 'TN': '突尼斯', 'LY': '利比亚', 'SD': '苏丹',
        'TZ': '坦桑尼亚', 'UG': '乌干达', 'GH': '加纳', 'CI': '科特迪瓦', 'SN': '塞内加尔',
        'ZW': '津巴布韦', 'AO': '安哥拉', 'MZ': '莫桑比克', 'MG': '马达加斯加',
        'BW': '博茨瓦纳', 'NA': '纳米比亚', 'RW': '卢旺达', 'MU': '毛里求斯',
        'CM': '喀麦隆', 'AQ': '南极'
    };

    const ISO_TO_ID = {
        'CN': '156', 'JP': '392', 'KR': '410', 'IN': '356', 'ID': '360', 
        'TH': '764', 'VN': '704', 'MY': '458', 'PH': '608', 'SG': '702',
        'PK': '586', 'BD': '50', 'MM': '104', 'KH': '116', 'LA': '418',
        'NP': '524', 'LK': '144', 'MN': '496', 'KZ': '398', 'UZ': '860',
        'TW': '158', 'HK': '344', 'MO': '446', 'AF': '4', 'IQ': '368', 'IR': '364',
        'KW': '414', 'QA': '634', 'BH': '48', 'OM': '512', 'JO': '400',
        'LB': '422', 'AZ': '31', 'GE': '268', 'AM': '51', 'KP': '408',
        'BT': '64', 'TM': '795', 'KG': '417', 'TJ': '762', 'SY': '760',
        'GB': '826', 'FR': '250', 'DE': '276', 'IT': '380', 'ES': '724',
        'NL': '528', 'BE': '56', 'CH': '756', 'AT': '40', 'SE': '752',
        'NO': '578', 'FI': '246', 'DK': '208', 'IE': '372', 'PT': '620',
        'GR': '300', 'PL': '616', 'CZ': '203', 'RO': '642', 'HU': '348',
        'UA': '804', 'RU': '643', 'TR': '792', 'SK': '703', 'BG': '100',
        'HR': '191', 'RS': '688', 'SI': '705', 'LT': '440', 'LV': '428',
        'EE': '233', 'BY': '112', 'MD': '498', 'IS': '352', 'LU': '442',
        'MT': '470', 'CY': '196', 'AL': '8', 'MK': '807', 'BA': '70', 'ME': '499',
        'US': '840', 'CA': '124', 'MX': '484', 'GT': '320', 'CU': '192',
        'HT': '332', 'DO': '214', 'JM': '388', 'PA': '591', 'CR': '188',
        'NI': '558', 'HN': '340', 'SV': '222', 'BZ': '84',
        'BR': '76', 'AR': '32', 'CL': '152', 'CO': '170', 'PE': '604',
        'VE': '862', 'EC': '218', 'BO': '68', 'PY': '600', 'UY': '858',
        'GY': '328', 'SR': '740',
        'AU': '36', 'NZ': '554', 'FJ': '242', 'PG': '598', 'NC': '540',
        'ZA': '710', 'EG': '818', 'NG': '566', 'KE': '404', 'MA': '504',
        'DZ': '12', 'TN': '788', 'GH': '288', 'ET': '231', 'TZ': '834',
        'UG': '800', 'CI': '384', 'SN': '686', 'CM': '120', 'AO': '24',
        'MZ': '508', 'MG': '450', 'ZW': '716', 'BW': '72', 'NA': '516',
        'RW': '646', 'MU': '480', 'LY': '434', 'SD': '729',
        'AE': '784', 'SA': '682', 'IL': '376', 'YE': '887',
        'AQ': '10'
    };

    const FLAG_EMOJI = {
        'CN': '🇨🇳', 'HK': '🇭🇰', 'TW': '🇹🇼', 'MO': '🇲🇴', 'JP': '🇯🇵', 'KR': '🇰🇷',
        'KP': '🇰🇵', 'SG': '🇸🇬', 'TH': '🇹🇭', 'VN': '🇻🇳', 'MY': '🇲🇾', 'ID': '🇮🇩',
        'PH': '🇵🇭', 'IN': '🇮🇳', 'PK': '🇵🇰', 'BD': '🇧🇩', 'MM': '🇲🇲', 'KH': '🇰🇭',
        'LA': '🇱🇦', 'NP': '🇳🇵', 'LK': '🇱🇰', 'BT': '🇧🇹', 'MN': '🇲🇳', 'KZ': '🇰🇿',
        'UZ': '🇺🇿', 'TM': '🇹🇲', 'KG': '🇰🇬', 'TJ': '🇹🇯', 'AZ': '🇦🇿', 'GE': '🇬🇪',
        'AM': '🇦🇲', 'KW': '🇰🇼', 'QA': '🇶🇦', 'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴',
        'LB': '🇱🇧', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'AF': '🇦🇫', 'SY': '🇸🇾', 'YE': '🇾🇪',
        'TR': '🇹🇷', 'AE': '🇦🇪', 'SA': '🇸🇦', 'IL': '🇮🇱',
        'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱',
        'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪', 'NO': '🇳🇴', 'FI': '🇫🇮',
        'DK': '🇩🇰', 'IE': '🇮🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'PL': '🇵🇱', 'CZ': '🇨🇿',
        'RO': '🇷🇴', 'HU': '🇭🇺', 'UA': '🇺🇦', 'RU': '🇷🇺', 'SK': '🇸🇰', 'BG': '🇧🇬',
        'HR': '🇭🇷', 'RS': '🇷🇸', 'SI': '🇸🇮', 'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪',
        'BY': '🇧🇾', 'MD': '🇲🇩', 'IS': '🇮🇸', 'LU': '🇱🇺', 'MT': '🇲🇹', 'CY': '🇨🇾',
        'AL': '🇦🇱', 'MK': '🇲🇰', 'BA': '🇧🇦', 'ME': '🇲🇪',
        'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'GT': '🇬🇹', 'CU': '🇨🇺', 'HT': '🇭🇹',
        'DO': '🇩🇴', 'JM': '🇯🇲', 'PA': '🇵🇦', 'CR': '🇨🇷', 'NI': '🇳🇮', 'HN': '🇭🇳',
        'SV': '🇸🇻', 'BZ': '🇧🇿',
        'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪',
        'EC': '🇪🇨', 'BO': '🇧🇴', 'PY': '🇵🇾', 'UY': '🇺🇾', 'GY': '🇬🇾', 'SR': '🇸🇷',
        'AU': '🇦🇺', 'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PG': '🇵🇬', 'NC': '🇳🇨',
        'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬', 'KE': '🇰🇪', 'MA': '🇲🇦', 'DZ': '🇩🇿',
        'TN': '🇹🇳', 'GH': '🇬🇭', 'ET': '🇪🇹', 'TZ': '🇹🇿', 'UG': '🇺🇬', 'CI': '🇨🇮',
        'SN': '🇸🇳', 'CM': '🇨🇲', 'AO': '🇦🇴', 'MZ': '🇲🇿', 'MG': '🇲🇬', 'ZW': '🇿🇼',
        'BW': '🇧🇼', 'NA': '🇳🇦', 'RW': '🇷🇼', 'MU': '🇲🇺', 'LY': '🇱🇾', 'SD': '🇸🇩',
        'AQ': '🇦🇶'
    };

    const container = document.getElementById('earth-drawer-container');
    const renderArea = document.getElementById('earth-render-area');
    const toggleBtn = document.getElementById('earth-toggle-btn');
    const closeBtn = document.getElementById('earth-close-btn');
    const countEl = document.getElementById('country-count');
    const totalCountEl = document.getElementById('total-count');
    const polygonCountEl = document.getElementById('polygon-count');
    const statusEl = document.getElementById('globe-status');

    let globeInstance = null;
    let isActive = false;
    let lastFlags = [];
    let countriesGeoJSON = null;
    let allPolygons = [];
    let emojiSupported = null;
    let starfield = null;

    // === 星空系统类 ===
    class Starfield {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.stars = [];
            this.resize();
            this.generateStars();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
        }

        generateStars() {
            this.stars = [];
            const numStars = 150;
            
            for (let i = 0; i < numStars; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                const size = Math.random() * 2 + 0.5;
                const brightness = Math.random() * 0.6 + 0.4;
                
                let color = '#ffffff';
                const rand = Math.random();
                if (rand < 0.05) {
                    color = '#00f0ff';
                } else if (rand < 0.08) {
                    color = '#29ffc6';
                }
                
                this.stars.push({
                    theta: theta,
                    phi: phi,
                    size: size,
                    brightness: brightness,
                    color: color,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        }

        update(globeLat, globeLng) {
            const gradient = this.ctx.createRadialGradient(
                this.centerX, this.centerY, 0,
                this.centerX, this.centerY, Math.max(this.canvas.width, this.canvas.height)
            );
            gradient.addColorStop(0, 'rgba(5, 8, 13, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const time = Date.now() * 0.001;
            
            const viewLat = (globeLat || 0) * Math.PI / 180 * 0.05;
            const viewLng = (globeLng || 0) * Math.PI / 180 * 0.05;

            this.stars.forEach(star => {
                let theta = star.theta - viewLng;
                let phi = star.phi;

                const x3d = Math.sin(phi) * Math.cos(theta);
                const y3d = Math.sin(phi) * Math.sin(theta);
                const z3d = Math.cos(phi);

                const y3dRot = y3d * Math.cos(viewLat) - z3d * Math.sin(viewLat);
                const z3dRot = y3d * Math.sin(viewLat) + z3d * Math.cos(viewLat);

                if (z3dRot > 0) {
                    const scale = 300 / (300 + z3dRot * 100);
                    const x2d = this.centerX + x3d * 600 * scale;
                    const y2d = this.centerY + y3dRot * 600 * scale;

                    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
                    const alpha = star.brightness * (0.7 + twinkle * 0.3) * Math.min(z3dRot * 2, 1);

                    this.ctx.beginPath();
                    const size = star.size * scale;
                    this.ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                    
                    const starGradient = this.ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 4);
                    starGradient.addColorStop(0, this.hexToRgba(star.color, alpha));
                    starGradient.addColorStop(0.5, this.hexToRgba(star.color, alpha * 0.3));
                    starGradient.addColorStop(1, this.hexToRgba(star.color, 0));
                    
                    this.ctx.fillStyle = starGradient;
                    this.ctx.fill();
                }
            });
        }

        hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }

    // === 生成透明网格地球纹理 ===
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

    // === 2. 原始数据函数 ===
    function checkEmojiSupport() {
        if (emojiSupported !== null) return emojiSupported;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.font = '28px serif';
            ctx.fillText('🇨🇳', 0, 28);
            const data = ctx.getImageData(0, 0, 32, 32).data;
            let colors = new Set();
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 50) colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);
            }
            emojiSupported = colors.size > 3;
        } catch (e) { emojiSupported = false; }
        return emojiSupported;
    }

    function getFlagHTML(code) {
        if (checkEmojiSupport() && FLAG_EMOJI[code]) {
            return `<span class="flag-emoji">${FLAG_EMOJI[code]}</span>`;
        }
        return `<img class="flag-img" src="https://flagcdn.com/w40/${code.toLowerCase()}.png" alt="${code}" onerror="this.outerHTML='🏁'"/>`;
    }

    async function loadGeoJSON() {
        if (countriesGeoJSON) return countriesGeoJSON;
        statusEl.textContent = 'CONNECTING...';
        try {
            const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            const topo = await res.json();
            countriesGeoJSON = topojson.feature(topo, topo.objects.countries).features;
            
            allPolygons = countriesGeoJSON.map(feat => ({
                id: feat.id,
                geometry: feat.geometry,
                code: null,
                isActive: false
            }));
            
            totalCountEl.textContent = allPolygons.length;
            return countriesGeoJSON;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    function filterPolygons(codes) {
        if (!countriesGeoJSON || codes.length === 0) return [];
        const result = [];
        codes.forEach(code => {
            const numericId = ISO_TO_ID[code];
            const feat = countriesGeoJSON.find(f => {
                const fid = String(f.id);
                const props = f.properties || {};
                if (numericId && fid === numericId) return true;
                if (numericId && fid === numericId.padStart(3, '0')) return true;
                if (numericId && fid.replace(/^0+/, '') === numericId) return true;
                if (props.ISO_A2 === code || props.iso_a2 === code) return true;
                if (props.ISO_A3 === code || props.iso_a3 === code) return true;
                return false;
            });
            if (feat) result.push({ code, geometry: feat.geometry, id: feat.id, isActive: true });
        });
        polygonCountEl.textContent = result.length;
        return result;
    }

    function scanFlags() {
        const flags = new Set();
        document.querySelectorAll('[class*="flag-icon-"], [class*="fi-"]').forEach(el => {
            el.classList.forEach(cls => {
                const m = cls.match(/(?:flag-icon-|fi-)([a-z]{2})/i);
                if (m && COORD_MAP[m[1].toUpperCase()]) flags.add(m[1].toUpperCase());
            });
        });
        document.querySelectorAll('[data-country-code], [data-country]').forEach(el => {
            const code = (el.dataset.countryCode || el.dataset.country || '').toUpperCase();
            if (COORD_MAP[code]) flags.add(code);
        });
        document.querySelectorAll('img[src*="flag"]').forEach(img => {
            Object.keys(COORD_MAP).forEach(code => {
                if (img.src.toLowerCase().includes(`/${code.toLowerCase()}.`)) flags.add(code);
            });
        });
        return Array.from(flags);
    }

    function generateData() {
        const codes = scanFlags();
        const points = [], arcs = [];
        if (codes.length === 0) return { points, arcs, codes };
        const centerCode = 'DE'; 
        const centerCoord = COORD_MAP['DE'];
        codes.forEach(code => {
            const coord = COORD_MAP[code];
            if (coord) {
                points.push({ code, lat: coord[0], lng: coord[1] });
                if (code !== centerCode) {
                    arcs.push({
                        startLat: centerCoord[0], startLng: centerCoord[1],
                        endLat: coord[0], endLng: coord[1]
                    });
                }
            }
        });
        return { points, arcs, codes };
    }

    // === 3. 渲染 (使用中文名称) ===
    async function initGlobe() {
        if (globeInstance) { updateGlobe(); return; }
        
        const starCanvas = document.getElementById('starfield-canvas');
        starfield = new Starfield(starCanvas);
        
        function animateStarfield() {
            if (globeInstance && isActive) {
                const pov = globeInstance.pointOfView();
                starfield.update(pov.lat, pov.lng);
            } else if (isActive) {
                starfield.update(0, 0);
            }
            requestAnimationFrame(animateStarfield);
        }
        animateStarfield();
        
        statusEl.textContent = 'INITIALIZING...';
        await loadGeoJSON();
        const { points, arcs, codes } = generateData();
        
        countEl.textContent = codes.length;
        lastFlags = codes;
        
        const activePolygons = filterPolygons(codes);
        const activeIds = new Set(activePolygons.map(p => p.id));
        
        allPolygons.forEach(p => {
            const isActive = activeIds.has(p.id);
            p.isActive = isActive;
            if (isActive) {
                const active = activePolygons.find(ap => ap.id === p.id);
                if (active) p.code = active.code;
            }
        });

        try {
            const globe = Globe();
            globe(renderArea);
            
            const gridTexture = generateGridTexture();
            globe.globeImageUrl(gridTexture);
            globe.bumpImageUrl(null);
            globe.backgroundColor('rgba(0,0,0,0)');
            
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
            globe.polygonAltitude(0.01);
            
            globe.polygonCapColor(d => d.isActive ? 'rgba(0, 40, 50, 0.6)' : 'rgba(0, 0, 0, 0)');
            globe.polygonStrokeColor(d => d.isActive ? '#00f0ff' : '#ffffff');
            globe.polygonSideColor(() => 'rgba(0,0,0,0)');
            
            globe.onPolygonHover((polygon) => {
                globe.polygonCapColor(d => {
                    if (d === polygon) return d.isActive ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)';
                    return d.isActive ? 'rgba(0, 40, 50, 0.6)' : 'rgba(0, 0, 0, 0)';
                });
                globe.polygonStrokeColor(d => {
                    if (d === polygon) return d.isActive ? '#ffffff' : '#00f0ff';
                    return d.isActive ? '#00f0ff' : '#ffffff';
                });
                
                renderArea.style.cursor = polygon ? 'pointer' : 'crosshair';

                const oldLabel = document.querySelector('.earth-label-card.visible');
                if (oldLabel) oldLabel.classList.remove('visible');

                if (polygon && polygon.code) {
                    const labelEl = document.getElementById(`earth-label-${polygon.code}`);
                    if (labelEl) {
                        const card = labelEl.querySelector('.earth-label-card');
                        if(card) card.classList.add('visible');
                    }
                    globe.controls().autoRotate = false;
                } else {
                    globe.controls().autoRotate = true;
                }
            });
            globe.polygonLabel(() => null);

            globe.arcsData(arcs);
            globe.arcColor(() => ['rgba(0, 240, 255, 0.8)', 'rgba(41, 255, 198, 0.8)']);
            globe.arcDashLength(0.1); 
            globe.arcDashGap(0.05);
            globe.arcDashAnimateTime(4000);
            globe.arcStroke(0.2);
            globe.arcAltitude(0.4);

            globe.pointsData(points);
            globe.pointColor(() => '#ffffff');
            globe.pointAltitude(0.02);
            globe.pointRadius(0.3);
            
            globe.htmlElementsData(points);
            globe.htmlElement(d => {
                const el = document.createElement('div');
                el.id = `earth-label-${d.code}`;
                // 关键修改：显示中文名称
                const countryName = COUNTRY_NAME_CN[d.code] || d.code;
                el.innerHTML = `<div class="earth-label-card">
                    <div class="flag-display">${getFlagHTML(d.code)}</div>
                    <b>${countryName}</b>
                </div>`;
                el.style.pointerEvents = 'none';
                return el;
            });
            globe.htmlLat(d => d.lat);
            globe.htmlLng(d => d.lng);
            globe.htmlAltitude(0.1);

            globe.pointOfView({ lat: 20, lng: 0, altitude: 3.5 });
            globe.controls().autoRotate = true;
            globe.controls().autoRotateSpeed = 0.5;

            globeInstance = globe;
            statusEl.textContent = 'ONLINE';
            statusEl.style.color = '#00f0ff';

        } catch (error) {
            statusEl.textContent = 'ERR';
            statusEl.style.color = 'red';
            console.error(error);
        }
    }

    function updateGlobe() {
        if (!globeInstance) return;
        const { points, arcs, codes } = generateData();
        if (JSON.stringify(codes.sort()) === JSON.stringify(lastFlags.sort())) return;
        lastFlags = codes;
        countEl.textContent = codes.length;
        
        const activePolygons = filterPolygons(codes);
        const activeIds = new Set(activePolygons.map(p => p.id));
        
        allPolygons.forEach(p => {
            const isActive = activeIds.has(p.id);
            p.isActive = isActive;
            if (isActive) {
                const active = activePolygons.find(ap => ap.id === p.id);
                if (active) p.code = active.code;
            } else {
                p.code = null;
            }
        });
        
        globeInstance.polygonsData(allPolygons);
        globeInstance.pointsData(points);
        globeInstance.htmlElementsData(points);
        globeInstance.arcsData(arcs);
    }

    function toggle() {
        isActive = !isActive;
        if (isActive) {
            container.classList.add('active');
            toggleBtn.classList.add('hidden');
            setTimeout(initGlobe, 200);
        } else {
            container.classList.remove('active');
            toggleBtn.classList.remove('hidden');
            if (globeInstance && globeInstance.controls) {
                globeInstance.controls().autoRotate = false;
            }
        }
    }

    toggleBtn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', toggle);
    window.addEventListener('resize', () => {
        if (isActive && globeInstance) {
            globeInstance.width(renderArea.clientWidth);
            globeInstance.height(renderArea.clientHeight);
        }
    });
    setInterval(() => { if (isActive && globeInstance) updateGlobe(); }, 30000);
})();
