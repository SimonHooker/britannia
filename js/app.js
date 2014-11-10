var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

App.CHAT = [];

var mapDebugMode = ( window.location.search.substring(1) == 'mapdebug' );


var regionColours = {
	highland: '#006600',
	lowland: '#339933',
	water: '#000066',
	border: '#000000'
};


App.REGIONS = [
	{
		id: 'moray',
		name: {
			text: 'Moray',
			x: 440,
			y: 540
		},
		area: {
			paths: [
				'M545,397L507,410L486,401L425,410L378,518L395,583L426,598L535,620L580,535L573,504L548,502L549,481L533,463L502,482L479,482L510,449L494,441L520,427L542,414L548,402Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'caithness',
		name: {
			text: 'Caithness',
			x: 440,
			y: 300
		},
		area: {
			paths: [
				'M422,406L489,395L495,399L524,394L530,375L607,315L621,292L649,278L649,231L612,211L605,223L481,240L473,227L416,206L385,265L387,289L356,298L362,325L345,332L347,343L362,371Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'moray',
		name: {
			text: 'Skye',
			x: 307,
			y: 563,
		},
		area: {
			paths: [
				'M419,415L373,511L373,522L391,584L396,590L423,599L414,684L327,685L351,636L290,705L259,687L249,651L221,646L240,624L265,621L274,596L259,593L278,547L300,520L296,503L285,450L297,388L349,371Z',
				'M207,602L212,568L185,559L183,581Z',
				'M290,714L277,736L260,741L257,724L222,743L194,748L184,724L218,723L223,700L198,688L204,669L225,663L245,678L250,694Z',
				'M241,579L243,575L245,554L256,543L249,532L238,545L197,511L199,494L186,489L182,502L163,484L165,459L179,461L185,454L178,450L178,432L187,430L197,451L211,452L209,437L221,416L231,419L248,464L246,474L257,491L261,510L293,514L287,523L274,530L271,539L269,552L254,576Z',
				'M226,596L214,608L218,619L233,619L233,602Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'orkneys',
		name: {
			text: 'Orkneys',
			x: 630,
			y: 118
		},
		area: {
			paths: [
				'M618,103L610,151L650,160L650,178L664,192L677,170L694,150L678,135L697,112L715,118L711,101L720,79L722,66L696,81L670,78L657,58L648,64L648,80L629,96L630,104Z',
				'M605,167L616,158L641,183L632,189L620,189Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'mar',
		name: {
			text: 'Mar',
			x: 647,
			y: 528
		},
		area: {
			paths: [
				'M538,459L553,477L553,496L575,498L583,530L602,561L607,580L629,598L635,616L657,626L657,681L708,672L710,661L735,655L751,623L768,553L801,512L799,462L785,446L726,452L675,441L641,447L606,436L587,437L558,445Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'alban',
		name: {
			text: 'Alban',
			x: 502,
			y: 652
		},
		area: {
			paths: [
				'M427,602L414,715L476,721L492,737L574,720L655,683L656,628L633,618L627,600L604,583L599,563L599,562L582,539L537,623Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'hebridies',
		name: {
			text: 'Hebridies',
			x: 140,
			y: 314
		},
		area: {
			paths: [
				'M99,375L135,401L161,384L168,380L177,348L188,356L216,342L222,319L237,282L254,267L257,238L246,223L222,244L201,256L195,268L177,274L173,283L161,279L156,294L143,283L132,316L138,330L126,338L131,351Z',
				'M111,403L99,413L74,409L70,424L90,441L106,444L115,435L125,431Z',
				'M75,449L101,449L101,468L77,467Z',
				'M65,537L87,547L91,540L83,532L83,528L89,528L90,516L91,489L87,479L73,477L75,493L65,504Z',
				'M63,549L70,553L73,563L77,568L75,577L63,584L47,583L54,564L59,560Z'

			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'dunedin',
		name: {
			text: 'Dunedin',
			x: 511,
			y: 769
		},
		area: {
			paths: [
				'M492,738L578,722L658,684L708,674L718,672L694,714L678,722L650,726L636,722L626,726L618,736L602,748L590,750L594,756L606,756L622,744L640,740L644,734L662,736L664,752L696,772L694,778L664,790L648,790L624,810L626,822L606,824L590,818L572,824L554,820L546,814L542,818L552,832L590,838L646,838L648,826L654,820L682,820L688,830L712,850L706,868L688,868L682,878L652,880L648,890L634,888L622,908L614,908L614,900L594,900L584,890L574,892L570,896L548,892L534,878L536,868L522,860L518,850L504,848L490,836L490,822L484,812L480,764L488,758Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	},
	{
		id: 'dalriada',
		name: {
			text: 'Dalriada',
			x: 325,
			y: 752
		},
		area: {
			paths: [
				'M306,916L308,907L316,894L337,895L341,902L339,914L342,917L349,919L349,929L351,940L350,950L346,953L332,957L323,956L323,956L314,952L315,938L314,931L312,923Z',
				'M203,807L221,782L218,779L207,781L202,789L200,800Z',
				'M219,842L221,861L231,864L249,836L255,820L267,811L270,793L266,791L242,805L231,814L232,823L231,830L224,833Z',
				'M206,832L209,838L210,861L219,871L219,885L217,897L202,899L194,907L185,907L184,896L192,893L191,880L187,877L183,871L179,876L162,879L158,874L163,866L165,853L175,845L187,846L194,840L197,834Z',
				'M324,688L414,687L409,717L474,724L488,740L486,756L478,763L481,813L487,824L485,835L451,836L440,828L435,830L432,834L403,830L384,825L376,833L372,851L369,865L363,866L357,866L358,875L364,881L364,886L358,886L350,880L344,874L342,866L334,864L326,854L319,851L322,838L328,825L330,816L331,811L327,813L319,820L309,831L305,843L307,850L315,867L316,877L311,882L302,891L295,903L295,912L296,926L292,940L290,952L288,960L284,967L287,973L281,984L273,991L264,989L256,991L248,995L242,989L241,971L251,962L256,944L258,927L264,910L274,897L290,879L298,868L290,871L280,879L272,879L271,873L271,863L281,854L290,851L295,842L301,834L298,836L290,842L282,847L277,846L274,842L278,830L285,821L288,818L285,812L285,805L286,793L283,786L275,779L275,772L279,760L293,735L303,722L311,722L306,719L304,715L312,706L317,701L316,697L319,691Z'

			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'icelandic',
		name: {
			text: 'Icelandic Sea',
			x: 150,
			y: 80
		},
		area: {
			paths: [
				'M184,367L206,387L214,406L205,424L204,441L191,421L178,419L173,428L171,441L173,451L162,450L154,464L158,482L163,501L178,516L197,526L216,539L234,556L231,578L219,566L193,550L174,551L174,575L178,594L200,613L206,625L214,636L206,650L193,658L189,673L189,687L201,702L215,708L211,712L191,712L177,725L180,734L0,734L0,0L1370,0L1370,466L811,466L803,437L772,433L728,436L686,432L658,429L640,433L607,422L566,429L541,451L508,474L498,479L520,454L543,424L560,403L556,386L541,390L530,396L542,380L562,364L599,336L620,317L628,304L652,290L664,273L667,249L663,225L637,213L649,192L679,199L697,174L721,143L736,72L723,56L697,65L677,66L665,49L643,51L631,72L626,86L612,110L602,135L595,159L603,176L615,196L644,195L636,211L620,205L598,211L567,215L489,229L476,217L453,206L411,194L388,237L373,261L375,283L349,293L352,319L330,330L345,364L293,378L283,412L276,458L290,509L269,505L261,466L251,428L220,405L186,360L205,358L224,345L236,319L245,291L258,282L267,256L263,235L255,217L236,214L217,232L183,255L161,270L132,278L122,296L117,322L116,350L100,362L91,379L68,404L56,425L62,442L63,468L62,489L53,519L56,539L51,562L43,583L50,598L74,590L90,569L77,558L94,555L99,534L98,512L98,482L106,471L108,455L125,441L135,426L129,417L152,402Z'
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'northsea',
		name: {
			text: 'North Sea',
			x: 1000,
			y: 1050
		},
		area: {
			paths: [
				'M812,471L812,503L806,514L792,532L774,556L764,602L752,631L738,659L718,687L706,710L695,720L677,725L664,726L666,739L676,755L700,762L700,772L697,784L681,788L658,793L648,796L636,805L633,812L637,815L648,811L663,810L689,813L698,824L698,824L713,842L740,849L758,864L768,879L773,892L780,903L799,922L812,927L826,934L830,947L836,964L841,992L847,1017L848,1042L857,1058L867,1072L872,1085L872,1098L871,1116L886,1142L896,1153L926,1170L952,1190L970,1193L978,1210L1005,1246L1010,1262L1026,1273L1025,1286L1021,1304L1027,1318L1032,1330L1032,1345L1370,1345L1370,471Z'
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'atlantic',
		name: {
			text: 'Atlantic Ocean',
			x: 67,
			y: 1928
		},
		area: {
			paths: [
				'M599,1394L600,1434L582,1447L543,1457L505,1458L484,1462L465,1459L450,1441L429,1423L397,1431L381,1453L369,1464L375,1475L405,1500L409,1518L384,1533L359,1557L356,1586L402,1594L414,1575L431,1572L431,1599L447,1643L442,1676L432,1687L399,1721L367,1727L345,1732L335,1751L308,1749L291,1765L257,1781L261,1798L283,1806L270,1817L272,1838L284,1847L301,1873L326,1862L348,1859L374,1846L400,1854L399,1868L407,1883L435,1885L465,1882L477,1890L491,1905L511,1918L550,1928L579,1916L597,1903L597,1903L627,1889L648,1873L668,1855L683,1835L691,1825L683,1840L679,1854L670,1864L650,1883L635,1899L610,1918L587,1945L579,1957L553,1960L533,1953L489,1946L453,1958L420,1957L410,1973L408,1987L378,1996L366,1998L367,2019L336,2070L302,2089L281,2117L265,2140L240,2163L197,2179L178,2183L0,2183L0,1394Z'
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'irish',
		name: {
			text: 'Irish Sea',
			x: 118,
			y: 1127
		},
		area: {
			paths: [
				'M182,738L191,752L217,748L244,741L255,750L273,745L267,763L266,780L243,791L226,808L222,822L210,813L226,789L229,771L203,773L190,786L190,802L198,815L189,834L159,835L157,867L156,887L168,887L176,906L190,917L205,906L228,899L233,881L248,860L259,837L262,847L264,867L262,880L256,911L248,938L239,958L235,974L237,993L242,999L259,1002L285,998L302,976L301,958L301,938L308,937L310,953L319,959L335,963L355,957L359,944L359,922L352,908L352,896L368,898L369,906L383,922L393,936L396,947L389,961L381,982L367,1006L344,1043L326,1062L319,1081L327,1104L342,1123L364,1144L380,1149L432,1159L448,1153L454,1133L471,1137L501,1137L527,1121L560,1096L570,1095L562,1108L557,1125L540,1152L531,1181L533,1207L553,1242L571,1274L594,1284L610,1281L624,1281L628,1293L635,1313L615,1321L608,1336L609,1352L614,1367L621,1375L602,1387L0,1387L0,738Z',
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'strathclyde',
		name: {
			text: 'Strathclyde',
			x: 435,
			y: 924
		},
		area: {
			paths: [
				'M487,841L501,852L514,853L519,861L531,870L530,880L545,895L568,899L563,941L562,978L553,979L545,1004L513,984L498,978L481,983L468,1010L455,1007L427,1038L388,1059L354,1068L345,1053L354,1035L376,1006L388,981L396,967L405,952L403,930L390,915L378,905L375,891L380,865L382,846L399,847L415,849L418,845L409,841L394,837L388,833L379,840L381,831L387,829L401,833L422,836L439,836L440,832L448,839Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	},
// BELOW HERE, PATHS ARE MAPPED PER-BORDER
	{
		id: 'smercia',
		name: {
			text: 'South\nMercia',
			x: 836,
			y: 1818
		},
		area: {
			paths: [
				/* smercia-essex */ 'M955,1825L956,1832L959,1837L963,1846L963,1857L962,1864L963,1876L963,1884L961,1890L958,1895L956,1903L956,1912L953,1916L947,1920L938,1924L928,1936'+
				/* downlands-smercia */ 'L928,1936L926,1933L921,1926L912,1922L898,1919L888,1921L882,1918L875,1915L857,1915L840,1914L835,1910L836,1899L832,1888L820,1880L803,1880L795,1876L789,1873'+
				/* hwicce-smercia */ 'L788,1873L789,1831L785,1812L792,1802L800,1786'+
				/* nmercia-smercia */ 'L800,1786L802,1780L812,1775L820,1762L826,1750L836,1748L842,1743L848,1746L860,1745L869,1744L881,1741L894,1730L911,1721L924,1723L931,1720L935,1714L941,1715'+
				/* smercia-suffolk */ 'L941,1715L940,1731L938,1740L943,1754L944,1758L937,1779L938,1798L949,1808L955,1825'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}

	},
	{
		id: 'essex',
		name: {
			text: 'Essex',
			x: 1008,
			y: 1841
		},
		area: {
			paths: [
				/* essex-frisian */ 'M1070,1905L1068,1902L1062,1900L1062,1896L1072,1896L1079,1900L1099,1901L1105,1895L1117,1894L1124,1884L1157,1882L1161,1876L1163,1867L1164,1863L1169,1862L1169,1852L1173,1842L1172,1839L1163,1839L1162,1840L1159,1842L1150,1844L1147,1843L1148,1840L1160,1836L1171,1826L1175,1822L1180,1823L1183,1827L1194,1827L1203,1821L1213,1817L1214,1812L1217,1803L1212,1795L1205,1787'+
				/* essex-suffolk */ 'L1205,1787L1201,1786L1187,1787L1170,1783L1159,1783L1147,1787L1140,1778L1130,1772L1130,1765L1124,1765L1114,1765L1107,1760L1096,1758L1094,1763L1091,1767L1078,1765L1067,1760L1058,1766L1049,1771L1048,1777L1040,1784L1030,1788L1018,1790L1014,1796L1005,1799L998,1802L992,1807L986,1807L985,1815L978,1821L955,1825'+
				/* smercia-essex */ 'L955,1825L956,1832L959,1837L963,1846L963,1857L962,1864L963,1876L963,1884L961,1890L958,1895L956,1903L956,1912L953,1916L947,1920L938,1924L928,1936'+
				/* downlands-essex */ 'L928,1936L934,1945L936,1950L937,1953'+
				/* sussex-essex */ 'L937,1953L972,1957L1005,1956L1009,1950L1036,1948'+
				/* kent-essex */ 'L1036,1948L1047,1939L1047,1927L1058,1921L1066,1913L1070,1905'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	},
	{
		id: 'kent',
		name: {
			text: 'Kent',
			x: 1100,
			y: 1950
		},
		area: {
			paths: [
				/* kent-channel*/ 'M1238,1960L1232,1972L1226,1980L1213,1980L1198,1986L1177,2003L1175,2009L1174,2028L1169,2028L1149,2022'+
				/* kent-sussex */ 'L1149,2022L1146,2014L1140,2008L1121,2009L1114,2005L1102,2002L1099,2000L1088,1997L1085,1986L1074,1985L1069,1978L1047,1980L1041,1980L1037,1975L1036,1970L1039,1964L1036,1948'+
				/* kent-essex */ 'L1036,1948L1047,1939L1047,1927L1058,1921L1066,1913L1070,1905'+
				/* frisian-kent n-s */ 'L1070,1905L1090,1908L1093,1909L1101,1910L1105,1905L1113,1902L1122,1902L1137,1904L1140,1907L1136,1911L1128,1911L1126,1909L1124,1913L1128,1916L1138,1918L1161,1924L1179,1926L1189,1922L1202,1921L1212,1919L1224,1917L1238,1916L1240,1923L1235,1929L1235,1942L1238,1947L1238,1960'+
				'Z',
				/* isle of sheppey */ 'M1141,1911L1142,1907L1156,1907L1175,1919L1172,1920L1144,1916L1140,1913L1141,1911Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	},

// INCOMPLETES
	{
		id: 'channel',
		name: {
			text: 'English Channel',
			x: 621,
			y: 2181
		},
		area: {
			paths: [
				/* to border */ 'M0,2186L0,2274L1370,2274L1370,1960'+
				/* kent-channel*/ 'L1238,1960L1232,1972L1226,1980L1213,1980L1198,1986L1177,2003L1175,2009L1174,2028L1169,2028L1149,2022'+
/* PLACEHOLDER TO KEEP LAND VISIBLE WHILE GENERATING */ 'L979,2194'+
				'Z'
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'frisian',
		name: {
			text: 'Frisian Sea',
			x: 1156,
			y: 1419
		},
		area: {
			paths: [
				/* frisian-suffolk */ 'M1277,1652L1279,1666L1275,1675L1276,1688L1271,1691L1266,1701L1265,1717L1260,1724L1260,1739L1250,1760L1241,1760L1230,1772L1229,1781L1227,1783L1222,1783L1215,1782L1211,1778L1207,1773L1204,1773L1204,1775L1208,1784L1205,1787'+
				/* frisian-essex n-s */ 'L1205,1787L1212,1795L1217,1803L1214,1812L1213,1817L1203,1821L1194,1827L1183,1827L1180,1823L1175,1822L1171,1826L1160,1836L1148,1840L1147,1843L1150,1844L1159,1842L1162,1840L1163,1839L1172,1839L1173,1842L1169,1852L1169,1862L1164,1863L1163,1867L1161,1876L1157,1882L1124,1884L1117,1894L1105,1895L1099,1901L1079,1900L1072,1896L1062,1896L1062,1900L1068,1902L1070,1905'+
				/* frisian-kent n-s pt1 */ 'L1070,1905L1090,1908L1093,1909L1101,1910L1105,1905L1113,1902L1122,1902L1137,1904L1140,1907L1136,1911'+
				/* isle of sheppey */ 'L1141,1911L1142,1907L1156,1907L1175,1919L1172,1920L1144,1916L1140,1913L1141,1911'+
				/* frisian-kent n-s pt2 */ 'L1136,1911L1128,1911L1126,1909L1124,1913L1128,1916L1138,1918L1161,1924L1179,1926L1189,1922L1202,1921L1212,1919L1224,1917L1238,1916L1240,1923L1235,1929L1235,1942L1238,1947L1238,1960'+
				/* to border */ 'L1370,1960L1370,1652'+
				'Z'
			],
			fill: regionColours.water,
			stroke: regionColours.water
		}
	},
	{
		id: 'nmercia',
		name: {
			text: 'North\nMercia',
			x: 822,
			y: 1626
		},
		area: {
			paths: [
				/* nmercia-hwicce */ 'M752,1660L752,1667L748,1676L761,1683L772,1687L772,1697L764,1705L759,1713L759,1722L761,1731L775,1748L790,1763L797,1776L800,1786'+
				/* nmercia-smercia */ 'L800,1786L802,1780L812,1775L820,1762L826,1750L836,1748L842,1743L848,1746L860,1745L869,1744L881,1741L894,1730L911,1721L924,1723L931,1720L935,1714L941,1715'+
				/* nmercia-suffolk */ 'L941,1715L955,1714L960,1702L974,1698L978,1689'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}

	},
	{
		id: 'suffolk',
		name: {
			text: 'Suffolk',
			x: 1045,
			y: 1712
		},
		area: {
			paths: [
				/* frisian-suffolk */ 'M1277,1652L1279,1666L1275,1675L1276,1688L1271,1691L1266,1701L1265,1717L1260,1724L1260,1739L1250,1760L1241,1760L1230,1772L1229,1781L1227,1783L1222,1783L1215,1782L1211,1778L1207,1773L1204,1773L1204,1775L1208,1784L1205,1787'+
				/* essex-suffolk */ 'L1205,1787L1201,1786L1187,1787L1170,1783L1159,1783L1147,1787L1140,1778L1130,1772L1130,1765L1124,1765L1114,1765L1107,1760L1096,1758L1094,1763L1091,1767L1078,1765L1067,1760L1058,1766L1049,1771L1048,1777L1040,1784L1030,1788L1018,1790L1014,1796L1005,1799L998,1802L992,1807L986,1807L985,1815L978,1821L955,1825'+
				/* smercia-suffolk */ 'L955,1825L949,1808L938,1798L937,1779L944,1758L943,1754L938,1740L940,1731L941,1715'+
				/* nmercia-suffolk */ 'L941,1715L955,1714L960,1702L974,1698L978,1689'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}

	},
	{
		id: 'hwicce',
		name: {
			text: 'Hwicce',
			x: 659,
			y: 1759
		},
		area: {
			paths: [
				/* nmercia-hwicce */ 'M752,1660L752,1667L748,1676L761,1683L772,1687L772,1697L764,1705L759,1713L759,1722L761,1731L775,1748L790,1763L797,1776L800,1786'+
				/* hwicce-smercia */ 'L800,1786L792,1802L785,1812L789,1831L788,1873'+
				/* downlands-hwicce */ 'L788,1873L781,1875L777,1870L770,1873L762,1876L751,1876L747,1872L736,1871L726,1872L718,1880L714,1883'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	},
	{
		id: 'downlands',
		name: {
			text: 'Downlands',
			x: 769,
			y: 1930
		},
		area: {
			paths: [
				/* downlands-hwicce */ 'M714,1883L718,1880L726,1872L736,1871L747,1872L751,1876L762,1876L770,1873L777,1870L781,1875L788,1873'+
				/* downlands-smercia */  'L788,1873L795,1876L803,1880L820,1880L832,1888L836,1899L835,1910L840,1914L857,1915L875,1915L882,1918L888,1921L898,1919L912,1922L921,1926L926,1933L928,1936'+
				/* downlands-essex */ 'L928,1936L934,1945L936,1950L937,1953'+
				/* downlands-sussex */ 'L937,1953L934,1961L923,1993L912,1997L906,1998'+
				'Z'
			],
			fill: regionColours.highland,
			stroke: regionColours.border
		}
	},
	{
		id: 'sussex',
		name: {
			text: 'Sussex',
			x: 956,
			y: 2004
		},
		area: {
			paths: [
				/* kent-sussex */ 'M1149,2022L1146,2014L1140,2008L1121,2009L1114,2005L1102,2002L1099,2000L1088,1997L1085,1986L1074,1985L1069,1978L1047,1980L1041,1980L1037,1975L1036,1970L1039,1964L1036,1948'+
				/* sussex-essex */ 'L1036,1948L1009,1950L1005,1956L972,1957L937,1953'+
				/* downlands-sussex */ 'L937,1953L934,1961L923,1993L912,1997L906,1998'+
				'Z'
			],
			fill: regionColours.lowland,
			stroke: regionColours.border
		}
	}

];

App.BOARD = {
	regions: App.REGIONS,
	paper: undefined
};

App.GAME = {
	chat: App.CHAT,
	board: App.BOARD
};

App.ApplicationRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();
		if (!mapDebugMode) {
			this.render( 'signin-form' , {
				into: 'application',
				outlet: 'signin'
			});
		}
		this.render( 'chat' , {
			into: 'application',
			outlet: 'chat'
		});
	}
});


App.GameRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();

		// Create the game board
		$(function(){
			if (
				typeof model.board.paper === 'undefined'
			) {
				model.board.paper = Raphael('raphael-game-board',1370,2274);
				$.each(model.board.regions,function(i,region){

					region.area.o = model.board.paper.set();

					$.each( this.area.paths , function(j,path){
						region.area.o.push(
							model.board.paper.path(
								path
							)
						);
					});

					region.area.o.attr({
						fill: region.area.fill,
						stroke: region.area.stroke,
						opacity: mapDebugMode?0.8:1
					});


					region.name.o = model.board.paper.text( 
						region.name.x, 
						region.name.y, 
						region.name.text 
					).attr({
						'text-anchor': 'start',
						'fill': '#FFFFFF',
						'font-size': '20px'
					});
				});


				if (mapDebugMode) {
					var insertDebugCoords = function() {
						var arrTemp = [];
						var pathTemp = undefined;

						var echoForm = $('<div>&nbsp;</div>');
						echoForm.insertBefore($('#raphael-game-board'));

						$('<button class="btn btn-danger">RESET</button>').on('click',function(e){
							e.preventDefault();
							arrTemp = [];
							if (pathTemp) {
								pathTemp.remove();
							}
						}).insertBefore($('#raphael-game-board'));

						var getPathFrom = function(arr) {
							return 'M'+arr.join('L')+'Z';
						};

						$('#raphael-game-board').css({
							'background-image': "url('/images/map_1370.jpg')"
						}).on('click',function(e){

							console.log(e);
							posx = Math.round(e.pageX - $(this).offset().left);
							posy = Math.round(e.pageY - $(this).offset().top);

							arrTemp.push(posx+','+posy);

							if (pathTemp) {
								pathTemp.remove();
							}

							var s = getPathFrom( arrTemp );
							arrTemp.reverse();
							var s2 = getPathFrom( arrTemp );
							arrTemp.reverse();


							echoForm.html(s+'<br>'+s2);

							pathTemp = model.board.paper.path(
								getPathFrom( arrTemp )
							).attr({
								fill: '#FF0000',
								opacity: 0.5
							});
						});
					};
					insertDebugCoords();
				}

			}
		});

	},
	model: function() {
		return App.GAME;
	}
});


socket.on('connect',function(data){});

socket.on('messages',function(data){
	App.CHAT.unshiftObject(data);
});

socket.on('signedin',function(data){
	$('div.signin-modal').remove();
});

$(function(){

	$('body')
		.on('submit','form.simple-form',function(e){
			e.preventDefault();
			var form = $(this);
			var action = form.data('action') || '';
			if (
				action.length > 0
			) {
				var input = form.find('input');
				var message = input.val();
				if (message.length > 0) {
					input.val('');
					socket.emit( action , message );
				}
			}
		})
		.on('click','form.simple-form button',function(e){
			e.preventDefault();
			$(this).closest('form').trigger('submit');
		});
		

});