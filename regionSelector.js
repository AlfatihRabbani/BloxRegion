async function regionSelectorInitiate() {
	(function injectIconHideStyle() {
		const style = document.createElement('style');
		style.id = 'rr-random-server-btn-hide';
		style.textContent = '.random-server-button, #rrp-btn-wrapper, #rrp-our-play-btn { display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; overflow: hidden !important; min-width: 0 !important; margin: 0 !important; padding: 0 !important; }';
		if (document.head) {
			document.head.appendChild(style);
		} else {
			const observer = new MutationObserver(() => {
				if (document.head) {
					document.head.appendChild(style);
					observer.disconnect();
				}
			});
			observer.observe(document.documentElement, { childList: true, subtree: true });
		}
	})();

	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	let csrfToken = null;
	try {
		var languageCode = (await (await fetch('https://locale.roblox.com/v1/locales/user-localization-locus-supported-locales', {
			credentials: 'include'
		})).json())['generalExperience']['locale']
	} catch {
		var languageCode = 'en_us'
	}

	if (languageCode == 'en_us') {
		var serversIn_Translated = `Servers in`;
		var closeButton_Translated = `Close`;
		var loadMoreServers_Translated = `Load More Servers`;
		var serversText_Translated = `SERVER_COUNT server`;
		var serversText_Plural_Translated = `SERVER_COUNT servers`;
		var unknown_Translated = `Unknown`;
		var unknownLocation_Translated = `Unknown Location`;
		var loading_Translated = `Loading...`;
		var errorLoadingServers_Translated = `Error loading servers. Please try again.`;
		var errorLoadingMore_Translated = `Error loading more servers`;
		var noPlayersOnline_Translated = `No players online`;
		var fetchingMoreServers_Translated = `Fetching more servers...`;
		var unknownRegion_Translated = `Unknown Region`;
		var membershipRequired_Translated = `Membership Required`;
		var planNeeded_Translated = `plan needed`;
		var dismiss_Translated = `Dismiss`;
		var viewMembership_Translated = `View Membership`;
		var serverLocations_Translated = `Server Locations`;
		var roregionDashboard_Translated = `RoRegion Dashboard`;
		var membership_Translated = `Membership`;
		var loadingMembership_Translated = `Loading membership...`;
		var expiring_Translated = `Expiring`;
		var planActive_Translated = `Active`
		var renewsOn_Translated = `Renews`;
		var expiresOn_Translated = `Expires`;;
		var switchPlan_Translated = `Switch Plan`;
		var bestValue_Translated = `Best Value`;
		var upgrade_Translated = `Upgrade`;
		var switchTier_Translated = `Switch`;
		var topTierMessage_Translated = `You're on the top tier — nothing higher available.`;
		var autoRenews_Translated = `Auto-renews monthly via Roblox private server.`;
		var privateServerHosted_Translated = `Private server hosted on this game`;
		var monthlyTotal_Translated = `Monthly total`;
		var confirmUpgrade_Translated = `Confirm — Upgrade`;
		var upgradedWelcome_Translated = `✓ Upgraded! Welcome to`;
		var subscribeYouTube_Translated = `Subscribe on YouTube`;
		var subscribeDesc_Translated = `Support us and stay up to date with the latest updates!`;
		var disclaimer_Translated = `Due to Roblox's rate limits and ongoing platform changes, it may take a couple of minutes for all servers to fully load. This is outside of our control — thanks for your patience.`;
		var noServersRegion_Translated = `No servers found in this region. Try refreshing.`;
		var loadingRegions_Translated = `Loading regions...`;
		var noServersFound_Translated = `No servers found. Try refreshing.`;
		var noActiveServers_Translated = `No active servers found in this region.`;
		var playersCount_Translated = `players`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Subscribe`;
		var tierBasicLabel_Translated = `Basic`;
		var tierRegularLabel_Translated = `Regular`;
		var tierUnlimitedLabel_Translated = `Unlimited`;
		var tierBasicDesc_Translated = `Great for getting started — access all red-ping servers across every region.`;
		var tierRegularDesc_Translated = `Step up to yellow-ping servers for noticeably better response times.`;
		var tierUnlimitedDesc_Translated = `The full network — every region, every server, lowest possible ping.`;
		var tierBasicPingLabel_Translated = `Red servers only`;
		var tierRegularPingLabel_Translated = `Yellow + red servers`;
		var tierUnlimitedPingLabel_Translated = `All servers — green, yellow & red`;
		var tierBasicFeat1_Translated = `Red-ping servers`;
		var tierBasicFeat2_Translated = `All core regions`;
		var tierBasicFeat3_Translated = `Higher ping (~150ms+)`;
		var tierRegularFeat1_Translated = `Yellow + red-ping servers`;
		var tierRegularFeat2_Translated = `More regions available`;
		var tierRegularFeat3_Translated = `Solid ping (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Green + yellow + red servers`;
		var tierUnlimitedFeat2_Translated = `Every region unlocked`;
		var tierUnlimitedFeat3_Translated = `Best ping (<80ms)`;
		var gateDescGreen_Translated = `This is a green-ping server. You need the Unlimited plan to join it.`;
		var gateDescYellow_Translated = `This is a yellow-ping server. You need the Regular plan or higher to join it.`;
		var gateDescRed_Translated = `This is a red-ping server. You need the Basic plan or higher to join it.`;
		var perMonth_Translated = `/ month`;
		var perMonthShort_Translated = `/ mo`;
		var configError_Translated = `Config error`;
		var back_Translated = `← Back`;
		var subscriptionGame_Translated = `Subscription Game`;
		var notEnoughRobux_Translated = `You do not have enough Robux to purchase this.`;
		var permissionUpdateTitle_Translated = `Region Selector Update`;
		var permissionUpdateDesc_Translated = `RoRegion now uses our backend API for improved speed, more server locations, and expanded regions including Brazil and more. Grant access below to continue.`;
		var permissionWelcomeTitle_Translated = `Welcome to RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion gives you full control over which Roblox server you join — choose by region, see ping estimates, and find the best server for your connection. Grant access below to get started.`;
		var permissionAgree_Translated = `Agree & Continue`;
		var permissionWhatsNew_Translated = `What's New`;
		var permissionGotIt_Translated = `Got it — Let's Go`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `A one-time permission is required to connect to the RoRegion API.`;
		var planSuffix_Translated = `Plan`;
		var feat1Name_Translated = `Server Regions`;
		var feat1Desc_Translated = `Browse servers grouped by region — Singapore, US, EU, Brazil, and more.`;
		var feat2Name_Translated = `Ping Estimates`;
		var feat2Desc_Translated = `See estimated ping for every server before you join.`;
		var feat3Name_Translated = `Direct Server Join`;
		var feat3Desc_Translated = `Jump straight into a specific server, skipping the matchmaker entirely.`;
		var feat4Name_Translated = `Membership Tiers`;
		var feat4Desc_Translated = `Unlock lower-ping servers with Basic, Regular, or Unlimited plans.`;
		var change1Name_Translated = `Backend API`;
		var change1Desc_Translated = `Server data now routes through our own API for faster load times across all regions.`;
		var change2Name_Translated = `More Regions`;
		var change2Desc_Translated = `Brazil, and additional locations have been added to the server browser.`;
		var change3Name_Translated = `More Server Locations`;
		var change3Desc_Translated = `Expanded coverage — more specific data centers are now tracked and displayed.`;
		var change4Name_Translated = `Improved UI`;
		var change4Desc_Translated = `Refreshed region selector layout with cleaner server cards and better organization.`;
		var balanceCheckFailed_Translated = `Balance check failed. Try again.`;
		var purchaseFailed_Translated = `Purchase failed`;
		var unknownError_Translated = `Unknown error. Check Roblox and try again.`;
		var newPlanActive_Translated = `⚠ New plan active. Old plan may need manual cancellation in Roblox settings.`;
		var joinTheGameToSubscribe_Translated = `Join the game to subscribe`;
		var planActivatesInstantly_Translated = `Your plan activates instantly after purchasing inside the game.`;
		var unlimitedPlanRequired_Translated = `An Unlimited plan is required to join this server. Subscribe in-game to unlock every region.`;
		var couldNotPreparePurchase_Translated = `Could not prepare purchase. Try again.`;
		var launching_Translated = `✓ Launching… Complete the purchase in-game.`;
		var comeBackAfterSubscribing_Translated = `Come back here after subscribing to refresh your plan.`;
		var stepPressPlay_Translated = `Press play`;
		var stepSubscribeInGame_Translated = `Subscribe in-game`;
		var stepComeBackRefresh_Translated = `Come back & refresh`;
	}
	if (languageCode == 'id_id') {
		var serversIn_Translated = `Server di`;
		var closeButton_Translated = `Tutup`;
		var loadMoreServers_Translated = `Muat Lebih Banyak Server`;
		var serversText_Translated = `SERVER_COUNT server`;
		var serversText_Plural_Translated = `SERVER_COUNT server`;
		var unknown_Translated = `Tidak Diketahui`;
		var unknownLocation_Translated = `Lokasi Tidak Diketahui`;
		var loading_Translated = `Memuat...`;
		var errorLoadingServers_Translated = `Kesalahan memuat server. Silakan coba lagi.`;
		var errorLoadingMore_Translated = `Kesalahan memuat lebih banyak server`;
		var noPlayersOnline_Translated = `Tidak ada pemain online`;
		var fetchingMoreServers_Translated = `Mengambil lebih banyak server...`;
		var unknownRegion_Translated = `Wilayah Tidak Diketahui`;
		var membershipRequired_Translated = `Keanggotaan Diperlukan`;
		var planNeeded_Translated = `paket diperlukan`;
		var dismiss_Translated = `Tutup`;
		var viewMembership_Translated = `Lihat Keanggotaan`;
		var serverLocations_Translated = `Lokasi Server`;
		var roregionDashboard_Translated = `Dasbor RoRegion`;
		var membership_Translated = `Keanggotaan`;
		var loadingMembership_Translated = `Memuat keanggotaan...`;
		var expiring_Translated = `Kedaluwarsa`;
		var planActive_Translated = `Aktif`;
		var renewsOn_Translated = `Yenileniyor`;
		var expiresOn_Translated = `Süresi doluyor`;
		var renewsOn_Translated = `Diperbarui`;
		var expiresOn_Translated = `Kedaluwarsa`;
		var switchPlan_Translated = `Ganti Paket`;
		var bestValue_Translated = `Nilai Terbaik`;
		var upgrade_Translated = `Tingkatkan`;
		var switchTier_Translated = `Ganti`;
		var topTierMessage_Translated = `Anda berada di tingkat tertinggi — tidak ada yang lebih tinggi.`;
		var autoRenews_Translated = `Diperbarui otomatis setiap bulan melalui server pribadi Roblox.`;
		var privateServerHosted_Translated = `Server pribadi yang dihosting di game ini`;
		var monthlyTotal_Translated = `Total bulanan`;
		var confirmUpgrade_Translated = `Konfirmasi — Tingkatkan`;
		var upgradedWelcome_Translated = `✓ Ditingkatkan! Selamat datang di`;
		var subscribeYouTube_Translated = `Berlangganan di YouTube`;
		var subscribeDesc_Translated = `Dukung kami dan tetap update dengan pembaruan terbaru!`;
		var disclaimer_Translated = `Karena batas kecepatan Roblox dan perubahan platform, mungkin butuh beberapa menit agar semua server dimuat sepenuhnya. Ini di luar kendali kami — terima kasih atas kesabaran Anda.`;
		var noServersRegion_Translated = `Tidak ada server ditemukan di wilayah ini. Coba refresh.`;
		var loadingRegions_Translated = `Memuat wilayah...`;
		var noServersFound_Translated = `Tidak ada server ditemukan. Coba refresh.`;
		var noActiveServers_Translated = `Tidak ada server aktif ditemukan di wilayah ini.`;
		var playersCount_Translated = `pemain`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Berlangganan`;
		var tierBasicLabel_Translated = `Dasar`;
		var tierRegularLabel_Translated = `Reguler`;
		var tierUnlimitedLabel_Translated = `Tak Terbatas`;
		var tierBasicDesc_Translated = `Sempurna untuk memulai — akses semua server ping merah di setiap wilayah.`;
		var tierRegularDesc_Translated = `Tingkatkan ke server ping kuning untuk waktu respons yang lebih baik.`;
		var tierUnlimitedDesc_Translated = `Jaringan penuh — setiap wilayah, setiap server, ping serendah mungkin.`;
		var tierBasicPingLabel_Translated = `Hanya server merah`;
		var tierRegularPingLabel_Translated = `Server kuning + merah`;
		var tierUnlimitedPingLabel_Translated = `Semua server — hijau, kuning & merah`;
		var tierBasicFeat1_Translated = `Server ping merah`;
		var tierBasicFeat2_Translated = `Semua wilayah inti`;
		var tierBasicFeat3_Translated = `Ping lebih tinggi (~150ms+)`;
		var tierRegularFeat1_Translated = `Server ping kuning + merah`;
		var tierRegularFeat2_Translated = `Lebih banyak wilayah tersedia`;
		var tierRegularFeat3_Translated = `Ping stabil (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Server ping hijau + kuning + merah`;
		var tierUnlimitedFeat2_Translated = `Setiap wilayah terbuka`;
		var tierUnlimitedFeat3_Translated = `Ping terbaik (<80ms)`;
		var gateDescGreen_Translated = `Ini adalah server ping hijau. Anda membutuhkan paket Tak Terbatas untuk bergabung.`;
		var gateDescYellow_Translated = `Ini adalah server ping kuning. Anda membutuhkan paket Reguler atau lebih tinggi untuk bergabung.`;
		var gateDescRed_Translated = `Ini adalah server ping merah. Anda membutuhkan paket Dasar atau lebih tinggi untuk bergabung.`;
		var perMonth_Translated = `/ bulan`;
		var perMonthShort_Translated = `/ bln`;
		var configError_Translated = `Kesalahan konfigurasi`;
		var back_Translated = `← Kembali`;
		var subscriptionGame_Translated = `Game Langganan`;
		var notEnoughRobux_Translated = `Anda tidak memiliki cukup Robux untuk membeli ini.`;
		var permissionUpdateTitle_Translated = `Pembaruan Region Selector`;
		var permissionUpdateDesc_Translated = `RoRegion kini menggunakan API backend kami untuk kecepatan lebih baik, lebih banyak lokasi server, dan wilayah yang diperluas termasuk Brasil dan lainnya. Berikan akses di bawah untuk melanjutkan.`;
		var permissionWelcomeTitle_Translated = `Selamat Datang di RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion memberi Anda kendali penuh atas server Roblox mana yang Anda masuki — pilih berdasarkan wilayah, lihat estimasi ping, dan temukan server terbaik untuk koneksi Anda. Berikan akses di bawah untuk memulai.`;
		var permissionAgree_Translated = `Setuju & Lanjutkan`;
		var permissionWhatsNew_Translated = `Yang Baru`;
		var permissionGotIt_Translated = `Mengerti — Ayo Mulai`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Izin satu kali diperlukan untuk terhubung ke API RoRegion.`;
		var planSuffix_Translated = `Paket`;
		var feat1Name_Translated = `Wilayah Server`;
		var feat1Desc_Translated = `Telusuri server berdasarkan wilayah — Singapura, AS, EU, Brasil, dan lainnya.`;
		var feat2Name_Translated = `Estimasi Ping`;
		var feat2Desc_Translated = `Lihat estimasi ping untuk setiap server sebelum bergabung.`;
		var feat3Name_Translated = `Bergabung Langsung ke Server`;
		var feat3Desc_Translated = `Langsung masuk ke server tertentu, melewati matchmaker sepenuhnya.`;
		var feat4Name_Translated = `Tingkatan Keanggotaan`;
		var feat4Desc_Translated = `Buka server ping lebih rendah dengan paket Basic, Regular, atau Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Data server kini diarahkan melalui API kami sendiri untuk waktu muat lebih cepat di semua wilayah.`;
		var change2Name_Translated = `Lebih Banyak Wilayah`;
		var change2Desc_Translated = `Brasil dan lokasi tambahan telah ditambahkan ke browser server.`;
		var change3Name_Translated = `Lebih Banyak Lokasi Server`;
		var change3Desc_Translated = `Cakupan yang diperluas — lebih banyak pusat data spesifik kini dilacak dan ditampilkan.`;
		var change4Name_Translated = `UI yang Ditingkatkan`;
		var change4Desc_Translated = `Tampilan pemilih wilayah yang diperbarui dengan kartu server yang lebih bersih dan organisasi yang lebih baik.`;
		var balanceCheckFailed_Translated = `Pemeriksaan saldo gagal. Coba lagi.`;
		var purchaseFailed_Translated = `Pembelian gagal`;
		var unknownError_Translated = `Kesalahan tidak diketahui. Periksa Roblox dan coba lagi.`;
		var newPlanActive_Translated = `⚠ Paket baru aktif. Paket lama mungkin perlu dibatalkan secara manual di pengaturan Roblox.`;
		var joinTheGameToSubscribe_Translated = `Bergabunglah ke game untuk berlangganan`;
		var planActivatesInstantly_Translated = `Paket Anda aktif seketika setelah membeli di dalam game.`;
		var unlimitedPlanRequired_Translated = `Diperlukan paket Tidak Terbatas untuk bergabung ke server ini. Berlangganan dalam game untuk membuka setiap wilayah.`;
		var couldNotPreparePurchase_Translated = `Tidak dapat menyiapkan pembelian. Coba lagi.`;
		var launching_Translated = `✓ Meluncurkan… Selesaikan pembelian di dalam game.`;
		var comeBackAfterSubscribing_Translated = `Kembali ke sini setelah berlangganan untuk memperbarui paket Anda.`;
		var stepPressPlay_Translated = `Tekan putar`;
		var stepSubscribeInGame_Translated = `Berlangganan dalam game`;
		var stepComeBackRefresh_Translated = `Kembali & perbarui`;
	}
	if (languageCode == 'de_de') {
		var serversIn_Translated = `Server in`;
		var closeButton_Translated = `Schließen`;
		var loadMoreServers_Translated = `Mehr Server laden`;
		var serversText_Translated = `SERVER_COUNT Server`;
		var serversText_Plural_Translated = `SERVER_COUNT Server`;
		var unknown_Translated = `Unbekannt`;
		var unknownLocation_Translated = `Unbekannter Standort`;
		var loading_Translated = `Laden...`;
		var errorLoadingServers_Translated = `Fehler beim Laden der Server. Bitte versuchen Sie es erneut.`;
		var errorLoadingMore_Translated = `Fehler beim Laden weiterer Server`;
		var noPlayersOnline_Translated = `Keine Spieler online`;
		var fetchingMoreServers_Translated = `Weitere Server werden abgerufen...`;
		var unknownRegion_Translated = `Unbekannte Region`;
		var membershipRequired_Translated = `Mitgliedschaft erforderlich`;
		var planNeeded_Translated = `Plan erforderlich`;
		var dismiss_Translated = `Schließen`;
		var viewMembership_Translated = `Mitgliedschaft ansehen`;
		var serverLocations_Translated = `Serverstandorte`;
		var roregionDashboard_Translated = `RoRegion-Dashboard`;
		var membership_Translated = `Mitgliedschaft`;
		var loadingMembership_Translated = `Mitgliedschaft wird geladen...`;
		var expiring_Translated = `Läuft ab`;
		var planActive_Translated = `Aktiv`;
		var renewsOn_Translated = `Erneuert am`;
		var expiresOn_Translated = `Läuft ab am`;
		var switchPlan_Translated = `Plan wechseln`;
		var bestValue_Translated = `Bestes Preis-Leistungs-Verhältnis`;
		var upgrade_Translated = `Upgrade`;
		var switchTier_Translated = `Wechseln`;
		var topTierMessage_Translated = `Du bist auf dem höchsten Tier — nichts Höheres verfügbar.`;
		var autoRenews_Translated = `Wird monatlich über den privaten Roblox-Server verlängert.`;
		var privateServerHosted_Translated = `Privater Server, gehostet auf diesem Spiel`;
		var monthlyTotal_Translated = `Monatlicher Gesamtbetrag`;
		var confirmUpgrade_Translated = `Bestätigen — Upgrade`;
		var upgradedWelcome_Translated = `✓ Upgegradet! Willkommen bei`;
		var subscribeYouTube_Translated = `Auf YouTube abonnieren`;
		var subscribeDesc_Translated = `Unterstütze uns und bleib über die neuesten Updates auf dem Laufenden!`;
		var disclaimer_Translated = `Aufgrund der Rate-Limits von Roblox und laufenden Plattformänderungen kann es einige Minuten dauern, bis alle Server vollständig geladen sind. Dies liegt außerhalb unserer Kontrolle — vielen Dank für deine Geduld.`;
		var noServersRegion_Translated = `Keine Server in dieser Region gefunden. Versuche, die Seite zu aktualisieren.`;
		var loadingRegions_Translated = `Regionen werden geladen...`;
		var noServersFound_Translated = `Keine Server gefunden. Versuche, die Seite zu aktualisieren.`;
		var noActiveServers_Translated = `Keine aktiven Server in dieser Region gefunden.`;
		var playersCount_Translated = `Spieler`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Abonnieren`;
		var tierBasicLabel_Translated = `Basis`;
		var tierRegularLabel_Translated = `Regulär`;
		var tierUnlimitedLabel_Translated = `Unbegrenzt`;
		var tierBasicDesc_Translated = `Perfekt für den Einstieg — Zugang zu allen Rot-Ping-Servern in jeder Region.`;
		var tierRegularDesc_Translated = `Wechsle zu Gelb-Ping-Servern für deutlich bessere Reaktionszeiten.`;
		var tierUnlimitedDesc_Translated = `Das vollständige Netzwerk — jede Region, jeder Server, niedrigstmöglicher Ping.`;
		var tierBasicPingLabel_Translated = `Nur rote Server`;
		var tierRegularPingLabel_Translated = `Gelbe + rote Server`;
		var tierUnlimitedPingLabel_Translated = `Alle Server — grün, gelb & rot`;
		var tierBasicFeat1_Translated = `Rot-Ping-Server`;
		var tierBasicFeat2_Translated = `Alle Kernregionen`;
		var tierBasicFeat3_Translated = `Höherer Ping (~150ms+)`;
		var tierRegularFeat1_Translated = `Gelb + Rot-Ping-Server`;
		var tierRegularFeat2_Translated = `Mehr Regionen verfügbar`;
		var tierRegularFeat3_Translated = `Solider Ping (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Grün + Gelb + Rot-Ping-Server`;
		var tierUnlimitedFeat2_Translated = `Jede Region freigeschaltet`;
		var tierUnlimitedFeat3_Translated = `Bester Ping (<80ms)`;
		var gateDescGreen_Translated = `Dies ist ein Grün-Ping-Server. Du benötigst den Unbegrenzt-Plan, um beizutreten.`;
		var gateDescYellow_Translated = `Dies ist ein Gelb-Ping-Server. Du benötigst den Regulär-Plan oder höher, um beizutreten.`;
		var gateDescRed_Translated = `Dies ist ein Rot-Ping-Server. Du benötigst den Basis-Plan oder höher, um beizutreten.`;
		var perMonth_Translated = `/ Monat`;
		var perMonthShort_Translated = `/ Mo.`;
		var configError_Translated = `Konfigurationsfehler`;
		var back_Translated = `← Zurück`;
		var subscriptionGame_Translated = `Abonnement-Spiel`;
		var notEnoughRobux_Translated = `Du hast nicht genug Robux, um dies zu kaufen.`;
		var permissionUpdateTitle_Translated = `Region-Selector-Update`;
		var permissionUpdateDesc_Translated = `RoRegion verwendet jetzt unsere Backend-API für verbesserte Geschwindigkeit, mehr Serverstandorte und erweiterte Regionen einschließlich Brasilien und mehr. Erteile unten Zugriff, um fortzufahren.`;
		var permissionWelcomeTitle_Translated = `Willkommen bei RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion gibt dir die volle Kontrolle darüber, welchem Roblox-Server du beitrittst — wähle nach Region, sieh Ping-Schätzungen und finde den besten Server für deine Verbindung. Erteile unten Zugriff, um zu beginnen.`;
		var permissionAgree_Translated = `Zustimmen & Weiter`;
		var permissionWhatsNew_Translated = `Was ist neu`;
		var permissionGotIt_Translated = `Verstanden — Los geht's`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Eine einmalige Berechtigung ist erforderlich, um eine Verbindung zur RoRegion-API herzustellen.`;
		var planSuffix_Translated = `Plan`;
		var feat1Name_Translated = `Server-Regionen`;
		var feat1Desc_Translated = `Durchsuche Server nach Region — Singapur, USA, EU, Brasilien und mehr.`;
		var feat2Name_Translated = `Ping-Schätzungen`;
		var feat2Desc_Translated = `Sieh den geschätzten Ping für jeden Server, bevor du beitrittst.`;
		var feat3Name_Translated = `Direkter Server-Beitritt`;
		var feat3Desc_Translated = `Tritt direkt einem bestimmten Server bei und überspringe den Matchmaker vollständig.`;
		var feat4Name_Translated = `Mitgliedschaftsstufen`;
		var feat4Desc_Translated = `Schalte Server mit niedrigerem Ping mit Basic-, Regular- oder Unlimited-Plänen frei.`;
		var change1Name_Translated = `Backend-API`;
		var change1Desc_Translated = `Serverdaten werden jetzt über unsere eigene API für schnellere Ladezeiten in allen Regionen geleitet.`;
		var change2Name_Translated = `Mehr Regionen`;
		var change2Desc_Translated = `Brasilien und weitere Standorte wurden dem Server-Browser hinzugefügt.`;
		var change3Name_Translated = `Mehr Server-Standorte`;
		var change3Desc_Translated = `Erweiterte Abdeckung — mehr spezifische Rechenzentren werden jetzt verfolgt und angezeigt.`;
		var change4Name_Translated = `Verbessertes UI`;
		var change4Desc_Translated = `Überarbeitetes Region-Selector-Layout mit übersichtlicheren Server-Karten und besserer Organisation.`;
		var balanceCheckFailed_Translated = `Guthabenprüfung fehlgeschlagen. Erneut versuchen.`;
		var purchaseFailed_Translated = `Kauf fehlgeschlagen`;
		var unknownError_Translated = `Unbekannter Fehler. Überprüfe Roblox und versuche es erneut.`;
		var newPlanActive_Translated = `⚠ Neuer Plan aktiv. Alter Plan muss möglicherweise manuell in den Roblox-Einstellungen gekündigt werden.`;
		var joinTheGameToSubscribe_Translated = `Tritt dem Spiel bei, um zu abonnieren`;
		var planActivatesInstantly_Translated = `Dein Plan wird sofort nach dem Kauf im Spiel aktiviert.`;
		var unlimitedPlanRequired_Translated = `Ein Unbegrenzt-Plan ist erforderlich, um diesem Server beizutreten. Abonniere im Spiel, um jede Region freizuschalten.`;
		var couldNotPreparePurchase_Translated = `Kauf konnte nicht vorbereitet werden. Versuche es erneut.`;
		var launching_Translated = `✓ Wird gestartet… Schließe den Kauf im Spiel ab.`;
		var comeBackAfterSubscribing_Translated = `Komm nach dem Abonnieren hierher zurück, um deinen Plan zu aktualisieren.`;
		var stepPressPlay_Translated = `Play drücken`;
		var stepSubscribeInGame_Translated = `Im Spiel abonnieren`;
		var stepComeBackRefresh_Translated = `Zurückkommen & aktualisieren`;
	}
	if (languageCode == 'es_es') {
		var serversIn_Translated = `Servidores en`;
		var closeButton_Translated = `Cerrar`;
		var loadMoreServers_Translated = `Cargar Más Servidores`;
		var serversText_Translated = `SERVER_COUNT servidor`;
		var serversText_Plural_Translated = `SERVER_COUNT servidores`;
		var unknown_Translated = `Desconocido`;
		var unknownLocation_Translated = `Ubicación Desconocida`;
		var loading_Translated = `Cargando...`;
		var errorLoadingServers_Translated = `Error al cargar servidores. Por favor intenta de nuevo.`;
		var errorLoadingMore_Translated = `Error al cargar más servidores`;
		var noPlayersOnline_Translated = `No hay jugadores en línea`;
		var fetchingMoreServers_Translated = `Obteniendo más servidores...`;
		var unknownRegion_Translated = `Región Desconocida`;
		var membershipRequired_Translated = `Membresía Requerida`;
		var planNeeded_Translated = `plan necesario`;
		var dismiss_Translated = `Descartar`;
		var viewMembership_Translated = `Ver Membresía`;
		var serverLocations_Translated = `Ubicaciones de Servidores`;
		var roregionDashboard_Translated = `Panel de RoRegion`;
		var membership_Translated = `Membresía`;
		var loadingMembership_Translated = `Cargando membresía...`;
		var expiring_Translated = `Por vencer`;
		var planActive_Translated = `Activo`;
		var renewsOn_Translated = `Se renueva el`;
		var expiresOn_Translated = `Vence el`;
		var switchPlan_Translated = `Cambiar Plan`;
		var bestValue_Translated = `Mejor Valor`;
		var upgrade_Translated = `Mejorar`;
		var switchTier_Translated = `Cambiar`;
		var topTierMessage_Translated = `Estás en el nivel más alto — no hay nada superior disponible.`;
		var autoRenews_Translated = `Se renueva mensualmente a través del servidor privado de Roblox.`;
		var privateServerHosted_Translated = `Servidor privado alojado en este juego`;
		var monthlyTotal_Translated = `Total mensual`;
		var confirmUpgrade_Translated = `Confirmar — Mejorar`;
		var upgradedWelcome_Translated = `✓ ¡Mejorado! Bienvenido a`;
		var subscribeYouTube_Translated = `Suscríbete en YouTube`;
		var subscribeDesc_Translated = `¡Apóyanos y mantente al día con las últimas actualizaciones!`;
		var disclaimer_Translated = `Debido a los límites de velocidad de Roblox y los cambios continuos de la plataforma, puede tardar un par de minutos en cargar todos los servidores. Esto está fuera de nuestro control — gracias por tu paciencia.`;
		var noServersRegion_Translated = `No se encontraron servidores en esta región. Intenta actualizar.`;
		var loadingRegions_Translated = `Cargando regiones...`;
		var noServersFound_Translated = `No se encontraron servidores. Intenta actualizar.`;
		var noActiveServers_Translated = `No se encontraron servidores activos en esta región.`;
		var playersCount_Translated = `jugadores`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Suscribirse`;
		var tierBasicLabel_Translated = `Básico`;
		var tierRegularLabel_Translated = `Regular`;
		var tierUnlimitedLabel_Translated = `Ilimitado`;
		var tierBasicDesc_Translated = `Ideal para empezar — accede a todos los servidores de ping rojo en cada región.`;
		var tierRegularDesc_Translated = `Pasa a servidores de ping amarillo para tiempos de respuesta notablemente mejores.`;
		var tierUnlimitedDesc_Translated = `La red completa — cada región, cada servidor, el ping más bajo posible.`;
		var tierBasicPingLabel_Translated = `Solo servidores rojos`;
		var tierRegularPingLabel_Translated = `Servidores amarillo + rojo`;
		var tierUnlimitedPingLabel_Translated = `Todos los servidores — verde, amarillo y rojo`;
		var tierBasicFeat1_Translated = `Servidores ping rojo`;
		var tierBasicFeat2_Translated = `Todas las regiones principales`;
		var tierBasicFeat3_Translated = `Ping más alto (~150ms+)`;
		var tierRegularFeat1_Translated = `Servidores ping amarillo + rojo`;
		var tierRegularFeat2_Translated = `Más regiones disponibles`;
		var tierRegularFeat3_Translated = `Ping sólido (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Servidores ping verde + amarillo + rojo`;
		var tierUnlimitedFeat2_Translated = `Cada región desbloqueada`;
		var tierUnlimitedFeat3_Translated = `Mejor ping (<80ms)`;
		var gateDescGreen_Translated = `Este es un servidor de ping verde. Necesitas el plan Ilimitado para unirte.`;
		var gateDescYellow_Translated = `Este es un servidor de ping amarillo. Necesitas el plan Regular o superior para unirte.`;
		var gateDescRed_Translated = `Este es un servidor de ping rojo. Necesitas el plan Básico o superior para unirte.`;
		var perMonth_Translated = `/ mes`;
		var perMonthShort_Translated = `/ mes`;
		var configError_Translated = `Error de configuración`;
		var back_Translated = `← Volver`;
		var subscriptionGame_Translated = `Juego de suscripción`;
		var notEnoughRobux_Translated = `No tienes suficientes Robux para comprar esto.`;
		var permissionUpdateTitle_Translated = `Actualización del Selector de Región`;
		var permissionUpdateDesc_Translated = `RoRegion ahora usa nuestra API de backend para mayor velocidad, más ubicaciones de servidores y regiones ampliadas incluyendo Brasil y más. Otorga acceso a continuación para continuar.`;
		var permissionWelcomeTitle_Translated = `Bienvenido a RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion te da control total sobre a qué servidor de Roblox te unes — elige por región, ve estimaciones de ping y encuentra el mejor servidor para tu conexión. Otorga acceso a continuación para comenzar.`;
		var permissionAgree_Translated = `Aceptar y Continuar`;
		var permissionWhatsNew_Translated = `Novedades`;
		var permissionGotIt_Translated = `Entendido — Vamos`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Se requiere un permiso único para conectarse a la API de RoRegion.`;
		var planSuffix_Translated = `Plan`;
		var feat1Name_Translated = `Regiones de Servidor`;
		var feat1Desc_Translated = `Explora servidores agrupados por región — Singapur, EE.UU., UE, Brasil y más.`;
		var feat2Name_Translated = `Estimaciones de Ping`;
		var feat2Desc_Translated = `Ve el ping estimado de cada servidor antes de unirte.`;
		var feat3Name_Translated = `Unirse Directamente al Servidor`;
		var feat3Desc_Translated = `Entra directamente a un servidor específico, saltándote el matchmaker por completo.`;
		var feat4Name_Translated = `Niveles de Membresía`;
		var feat4Desc_Translated = `Desbloquea servidores con menor ping con los planes Basic, Regular o Unlimited.`;
		var change1Name_Translated = `API de Backend`;
		var change1Desc_Translated = `Los datos del servidor ahora se enrutan a través de nuestra propia API para tiempos de carga más rápidos en todas las regiones.`;
		var change2Name_Translated = `Más Regiones`;
		var change2Desc_Translated = `Brasil y ubicaciones adicionales se han añadido al navegador de servidores.`;
		var change3Name_Translated = `Más Ubicaciones de Servidor`;
		var change3Desc_Translated = `Cobertura ampliada — ahora se rastrean y muestran más centros de datos específicos.`;
		var change4Name_Translated = `UI Mejorada`;
		var change4Desc_Translated = `Diseño del selector de región renovado con tarjetas de servidor más limpias y mejor organización.`;
		var balanceCheckFailed_Translated = `Error al verificar el saldo. Inténtalo de nuevo.`;
		var purchaseFailed_Translated = `Compra fallida`;
		var unknownError_Translated = `Error desconocido. Comprueba Roblox e inténtalo de nuevo.`;
		var newPlanActive_Translated = `⚠ Nuevo plan activo. Es posible que el plan anterior necesite cancelación manual en la configuración de Roblox.`;
		var joinTheGameToSubscribe_Translated = `Únete al juego para suscribirte`;
		var planActivatesInstantly_Translated = `Tu plan se activa al instante después de comprar dentro del juego.`;
		var unlimitedPlanRequired_Translated = `Se necesita un plan Ilimitado para unirse a este servidor. Suscríbete en el juego para desbloquear cada región.`;
		var couldNotPreparePurchase_Translated = `No se pudo preparar la compra. Inténtalo de nuevo.`;
		var launching_Translated = `✓ Iniciando… Completa la compra en el juego.`;
		var comeBackAfterSubscribing_Translated = `Vuelve aquí después de suscribirte para actualizar tu plan.`;
		var stepPressPlay_Translated = `Presionar play`;
		var stepSubscribeInGame_Translated = `Suscribirse en el juego`;
		var stepComeBackRefresh_Translated = `Volver y actualizar`;
	}
	if (languageCode == 'fr_fr') {
		var serversIn_Translated = `Serveurs en`;
		var closeButton_Translated = `Fermer`;
		var loadMoreServers_Translated = `Charger Plus de Serveurs`;
		var serversText_Translated = `SERVER_COUNT serveur`;
		var serversText_Plural_Translated = `SERVER_COUNT serveurs`;
		var unknown_Translated = `Inconnu`;
		var unknownLocation_Translated = `Localisation Inconnue`;
		var loading_Translated = `Chargement...`;
		var errorLoadingServers_Translated = `Erreur lors du chargement des serveurs. Veuillez réessayer.`;
		var errorLoadingMore_Translated = `Erreur lors du chargement de plus de serveurs`;
		var noPlayersOnline_Translated = `Aucun joueur en ligne`;
		var fetchingMoreServers_Translated = `Récupération de plus de serveurs...`;
		var unknownRegion_Translated = `Région Inconnue`;
		var membershipRequired_Translated = `Abonnement Requis`;
		var planNeeded_Translated = `forfait requis`;
		var dismiss_Translated = `Ignorer`;
		var viewMembership_Translated = `Voir l'Abonnement`;
		var serverLocations_Translated = `Emplacements des Serveurs`;
		var roregionDashboard_Translated = `Tableau de Bord RoRegion`;
		var membership_Translated = `Abonnement`;
		var loadingMembership_Translated = `Chargement de l'abonnement...`;
		var expiring_Translated = `Expire bientôt`;
		var planActive_Translated = `Actif`;
		var renewsOn_Translated = `Renouvelle le`;
		var expiresOn_Translated = `Expire le`;
		var switchPlan_Translated = `Changer de Forfait`;
		var bestValue_Translated = `Meilleur Rapport Qualité-Prix`;
		var upgrade_Translated = `Améliorer`;
		var switchTier_Translated = `Changer`;
		var topTierMessage_Translated = `Vous êtes au niveau le plus élevé — rien de supérieur disponible.`;
		var autoRenews_Translated = `Renouvellement automatique mensuel via le serveur privé Roblox.`;
		var privateServerHosted_Translated = `Serveur privé hébergé sur ce jeu`;
		var monthlyTotal_Translated = `Total mensuel`;
		var confirmUpgrade_Translated = `Confirmer — Améliorer`;
		var upgradedWelcome_Translated = `✓ Amélioré ! Bienvenue dans`;
		var subscribeYouTube_Translated = `S'abonner sur YouTube`;
		var subscribeDesc_Translated = `Soutenez-nous et restez au courant des dernières mises à jour !`;
		var disclaimer_Translated = `En raison des limites de débit de Roblox et des changements continus de la plateforme, le chargement complet de tous les serveurs peut prendre quelques minutes. Cela échappe à notre contrôle — merci pour votre patience.`;
		var noServersRegion_Translated = `Aucun serveur trouvé dans cette région. Essayez d'actualiser.`;
		var loadingRegions_Translated = `Chargement des régions...`;
		var noServersFound_Translated = `Aucun serveur trouvé. Essayez d'actualiser.`;
		var noActiveServers_Translated = `Aucun serveur actif trouvé dans cette région.`;
		var playersCount_Translated = `joueurs`;
		var pingUnknown_Translated = `Ping : ?`;
		var subscribe_Translated = `S'abonner`;
		var tierBasicLabel_Translated = `Basique`;
		var tierRegularLabel_Translated = `Standard`;
		var tierUnlimitedLabel_Translated = `Illimité`;
		var tierBasicDesc_Translated = `Idéal pour débuter — accédez à tous les serveurs à ping rouge dans chaque région.`;
		var tierRegularDesc_Translated = `Passez aux serveurs à ping jaune pour des temps de réponse nettement meilleurs.`;
		var tierUnlimitedDesc_Translated = `Le réseau complet — chaque région, chaque serveur, le ping le plus bas possible.`;
		var tierBasicPingLabel_Translated = `Serveurs rouges uniquement`;
		var tierRegularPingLabel_Translated = `Serveurs jaunes + rouges`;
		var tierUnlimitedPingLabel_Translated = `Tous les serveurs — verts, jaunes et rouges`;
		var tierBasicFeat1_Translated = `Serveurs à ping rouge`;
		var tierBasicFeat2_Translated = `Toutes les régions principales`;
		var tierBasicFeat3_Translated = `Ping plus élevé (~150 ms+)`;
		var tierRegularFeat1_Translated = `Serveurs à ping jaune + rouge`;
		var tierRegularFeat2_Translated = `Plus de régions disponibles`;
		var tierRegularFeat3_Translated = `Ping correct (~80–150 ms)`;
		var tierUnlimitedFeat1_Translated = `Serveurs à ping vert + jaune + rouge`;
		var tierUnlimitedFeat2_Translated = `Toutes les régions débloquées`;
		var tierUnlimitedFeat3_Translated = `Meilleur ping (<80 ms)`;
		var gateDescGreen_Translated = `C'est un serveur à ping vert. Vous avez besoin du forfait Illimité pour le rejoindre.`;
		var gateDescYellow_Translated = `C'est un serveur à ping jaune. Vous avez besoin du forfait Standard ou supérieur pour le rejoindre.`;
		var gateDescRed_Translated = `C'est un serveur à ping rouge. Vous avez besoin du forfait Basique ou supérieur pour le rejoindre.`;
		var perMonth_Translated = `/ mois`;
		var perMonthShort_Translated = `/ mois`;
		var configError_Translated = `Erreur de configuration`;
		var back_Translated = `← Retour`;
		var subscriptionGame_Translated = `Jeu d'abonnement`;
		var notEnoughRobux_Translated = `Vous n'avez pas assez de Robux pour effectuer cet achat.`;
		var permissionUpdateTitle_Translated = `Mise à jour de Region Selector`;
		var permissionUpdateDesc_Translated = `RoRegion utilise désormais notre API backend pour une vitesse améliorée, plus d'emplacements de serveurs et des régions élargies incluant le Brésil et plus encore. Accordez l'accès ci-dessous pour continuer.`;
		var permissionWelcomeTitle_Translated = `Bienvenue sur RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion vous donne un contrôle total sur le serveur Roblox que vous rejoignez — choisissez par région, consultez les estimations de ping et trouvez le meilleur serveur pour votre connexion. Accordez l'accès ci-dessous pour commencer.`;
		var permissionAgree_Translated = `Accepter & Continuer`;
		var permissionWhatsNew_Translated = `Nouveautés`;
		var permissionGotIt_Translated = `Compris — Allons-y`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Une autorisation unique est requise pour se connecter à l'API RoRegion.`;
		var planSuffix_Translated = `Forfait`;
		var feat1Name_Translated = `Régions de serveurs`;
		var feat1Desc_Translated = `Parcourez les serveurs regroupés par région — Singapour, États-Unis, UE, Brésil et plus encore.`;
		var feat2Name_Translated = `Estimations de ping`;
		var feat2Desc_Translated = `Consultez le ping estimé pour chaque serveur avant de le rejoindre.`;
		var feat3Name_Translated = `Rejoindre un serveur directement`;
		var feat3Desc_Translated = `Rejoignez directement un serveur spécifique, en contournant entièrement le matchmaker.`;
		var feat4Name_Translated = `Niveaux d'abonnement`;
		var feat4Desc_Translated = `Débloquez des serveurs à ping plus bas avec les forfaits Basique, Standard ou Illimité.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Les données de serveur transitent désormais par notre propre API pour des temps de chargement plus rapides dans toutes les régions.`;
		var change2Name_Translated = `Plus de régions`;
		var change2Desc_Translated = `Le Brésil et d'autres emplacements ont été ajoutés au navigateur de serveurs.`;
		var change3Name_Translated = `Plus d'emplacements de serveurs`;
		var change3Desc_Translated = `Couverture étendue — davantage de centres de données spécifiques sont désormais suivis et affichés.`;
		var change4Name_Translated = `Interface améliorée`;
		var change4Desc_Translated = `Disposition du sélecteur de région actualisée avec des cartes de serveurs plus claires et une meilleure organisation.`;
		var balanceCheckFailed_Translated = `Vérification du solde échouée. Réessayez.`;
		var purchaseFailed_Translated = `Achat échoué`;
		var unknownError_Translated = `Erreur inconnue. Vérifiez Roblox et réessayez.`;
		var newPlanActive_Translated = `⚠ Nouveau forfait actif. L'ancien forfait devra peut-être être annulé manuellement dans les paramètres Roblox.`;
		var joinTheGameToSubscribe_Translated = `Rejoins le jeu pour t'abonner`;
		var planActivatesInstantly_Translated = `Ton forfait s'active instantanément après l'achat dans le jeu.`;
		var unlimitedPlanRequired_Translated = `Un forfait Illimité est requis pour rejoindre ce serveur. Abonne-toi en jeu pour déverrouiller chaque région.`;
		var couldNotPreparePurchase_Translated = `Impossible de préparer l'achat. Réessaie.`;
		var launching_Translated = `✓ Lancement… Finalise l'achat dans le jeu.`;
		var comeBackAfterSubscribing_Translated = `Reviens ici après t'être abonné pour actualiser ton forfait.`;
		var stepPressPlay_Translated = `Appuyer sur play`;
		var stepSubscribeInGame_Translated = `S'abonner en jeu`;
		var stepComeBackRefresh_Translated = `Revenir et actualiser`;
	}
	if (languageCode == 'it_it') {
		var serversIn_Translated = `Server in`;
		var closeButton_Translated = `Chiudi`;
		var loadMoreServers_Translated = `Carica Altri Server`;
		var serversText_Translated = `SERVER_COUNT server`;
		var serversText_Plural_Translated = `SERVER_COUNT server`;
		var unknown_Translated = `Sconosciuto`;
		var unknownLocation_Translated = `Posizione Sconosciuta`;
		var loading_Translated = `Caricamento...`;
		var errorLoadingServers_Translated = `Errore nel caricamento dei server. Riprova.`;
		var errorLoadingMore_Translated = `Errore nel caricamento di altri server`;
		var noPlayersOnline_Translated = `Nessun giocatore online`;
		var fetchingMoreServers_Translated = `Recupero di altri server in corso...`;
		var unknownRegion_Translated = `Regione Sconosciuta`;
		var membershipRequired_Translated = `Abbonamento Richiesto`;
		var planNeeded_Translated = `piano necessario`;
		var dismiss_Translated = `Ignora`;
		var viewMembership_Translated = `Visualizza Abbonamento`;
		var serverLocations_Translated = `Posizioni dei Server`;
		var roregionDashboard_Translated = `Dashboard RoRegion`;
		var membership_Translated = `Abbonamento`;
		var loadingMembership_Translated = `Caricamento abbonamento...`;
		var expiring_Translated = `In scadenza`;
		var planActive_Translated = `Attivo`
		var renewsOn_Translated = `Rinnova il`;
		var expiresOn_Translated = `Scade il`;;
		var switchPlan_Translated = `Cambia Piano`;
		var bestValue_Translated = `Miglior Rapporto Qualità-Prezzo`;
		var upgrade_Translated = `Aggiorna`;
		var switchTier_Translated = `Cambia`;
		var topTierMessage_Translated = `Sei al livello più alto — niente di superiore disponibile.`;
		var autoRenews_Translated = `Si rinnova automaticamente ogni mese tramite server privato Roblox.`;
		var privateServerHosted_Translated = `Server privato ospitato su questo gioco`;
		var monthlyTotal_Translated = `Totale mensile`;
		var confirmUpgrade_Translated = `Conferma — Aggiorna`;
		var upgradedWelcome_Translated = `✓ Aggiornato! Benvenuto in`;
		var subscribeYouTube_Translated = `Iscriviti su YouTube`;
		var subscribeDesc_Translated = `Supportaci e rimani aggiornato con gli ultimi aggiornamenti!`;
		var disclaimer_Translated = `A causa dei limiti di velocità di Roblox e dei continui cambiamenti della piattaforma, potrebbe volerci qualche minuto per caricare completamente tutti i server. Questo è fuori dal nostro controllo — grazie per la tua pazienza.`;
		var noServersRegion_Translated = `Nessun server trovato in questa regione. Prova ad aggiornare.`;
		var loadingRegions_Translated = `Caricamento regioni...`;
		var noServersFound_Translated = `Nessun server trovato. Prova ad aggiornare.`;
		var noActiveServers_Translated = `Nessun server attivo trovato in questa regione.`;
		var playersCount_Translated = `giocatori`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Iscriviti`;
		var tierBasicLabel_Translated = `Base`;
		var tierRegularLabel_Translated = `Regolare`;
		var tierUnlimitedLabel_Translated = `Illimitato`;
		var tierBasicDesc_Translated = `Ottimo per iniziare — accedi a tutti i server ping rosso in ogni regione.`;
		var tierRegularDesc_Translated = `Passa ai server ping giallo per tempi di risposta notevolmente migliori.`;
		var tierUnlimitedDesc_Translated = `La rete completa — ogni regione, ogni server, il ping più basso possibile.`;
		var tierBasicPingLabel_Translated = `Solo server rossi`;
		var tierRegularPingLabel_Translated = `Server gialli + rossi`;
		var tierUnlimitedPingLabel_Translated = `Tutti i server — verde, giallo e rosso`;
		var tierBasicFeat1_Translated = `Server ping rosso`;
		var tierBasicFeat2_Translated = `Tutte le regioni principali`;
		var tierBasicFeat3_Translated = `Ping più alto (~150ms+)`;
		var tierRegularFeat1_Translated = `Server ping giallo + rosso`;
		var tierRegularFeat2_Translated = `Più regioni disponibili`;
		var tierRegularFeat3_Translated = `Ping stabile (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Server ping verde + giallo + rosso`;
		var tierUnlimitedFeat2_Translated = `Ogni regione sbloccata`;
		var tierUnlimitedFeat3_Translated = `Ping migliore (<80ms)`;
		var gateDescGreen_Translated = `Questo è un server ping verde. Hai bisogno del piano Illimitato per partecipare.`;
		var gateDescYellow_Translated = `Questo è un server ping giallo. Hai bisogno del piano Regolare o superiore per partecipare.`;
		var gateDescRed_Translated = `Questo è un server ping rosso. Hai bisogno del piano Base o superiore per partecipare.`;
		var perMonth_Translated = `/ mese`;
		var perMonthShort_Translated = `/ mese`;
		var configError_Translated = `Errore di configurazione`;
		var back_Translated = `← Indietro`;
		var subscriptionGame_Translated = `Gioco in abbonamento`;
		var notEnoughRobux_Translated = `Non hai abbastanza Robux per acquistare questo.`;
		var permissionUpdateTitle_Translated = `Aggiornamento Selettore Regione`;
		var permissionUpdateDesc_Translated = `RoRegion ora utilizza la nostra API backend per velocità migliorata, più posizioni di server e regioni ampliate incluso il Brasile e altro. Concedi l'accesso qui sotto per continuare.`;
		var permissionWelcomeTitle_Translated = `Benvenuto su RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion ti dà il pieno controllo su quale server Roblox ti unisci — scegli per regione, vedi le stime del ping e trova il server migliore per la tua connessione. Concedi l'accesso qui sotto per iniziare.`;
		var permissionAgree_Translated = `Accetta e Continua`;
		var permissionWhatsNew_Translated = `Novità`;
		var permissionGotIt_Translated = `Capito — Andiamo`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `È necessaria un'autorizzazione una tantum per connettersi all'API RoRegion.`;
		var planSuffix_Translated = `Piano`;
		var feat1Name_Translated = `Regioni Server`;
		var feat1Desc_Translated = `Sfoglia i server raggruppati per regione — Singapore, USA, UE, Brasile e altro.`;
		var feat2Name_Translated = `Stime Ping`;
		var feat2Desc_Translated = `Vedi il ping stimato per ogni server prima di unirti.`;
		var feat3Name_Translated = `Accesso Diretto al Server`;
		var feat3Desc_Translated = `Entra direttamente in un server specifico, saltando completamente il matchmaker.`;
		var feat4Name_Translated = `Livelli di Abbonamento`;
		var feat4Desc_Translated = `Sblocca server con ping più basso con i piani Basic, Regular o Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `I dati del server ora passano attraverso la nostra API per tempi di caricamento più rapidi in tutte le regioni.`;
		var change2Name_Translated = `Più Regioni`;
		var change2Desc_Translated = `Brasile e altre location sono stati aggiunti al browser dei server.`;
		var change3Name_Translated = `Più Posizioni Server`;
		var change3Desc_Translated = `Copertura ampliata — più data center specifici vengono ora tracciati e visualizzati.`;
		var change4Name_Translated = `UI Migliorata`;
		var change4Desc_Translated = `Layout del selettore di regione rinnovato con schede server più pulite e organizzazione migliore.`;
		var balanceCheckFailed_Translated = `Verifica del saldo fallita. Riprova.`;
		var purchaseFailed_Translated = `Acquisto fallito`;
		var unknownError_Translated = `Errore sconosciuto. Controlla Roblox e riprova.`;
		var newPlanActive_Translated = `⚠ Nuovo piano attivo. Il vecchio piano potrebbe richiedere la cancellazione manuale nelle impostazioni di Roblox.`;
		var subscribe_Translated = `S'abonner`;
		var tierBasicLabel_Translated = `Basique`;
		var tierRegularLabel_Translated = `Régulier`;
		var tierUnlimitedLabel_Translated = `Illimité`;
		var tierBasicDesc_Translated = `Parfait pour commencer — accédez à tous les serveurs ping rouge dans chaque région.`;
		var tierRegularDesc_Translated = `Passez aux serveurs ping jaune pour des temps de réponse nettement meilleurs.`;
		var tierUnlimitedDesc_Translated = `Le réseau complet — chaque région, chaque serveur, le ping le plus bas possible.`;
		var tierBasicPingLabel_Translated = `Serveurs rouges uniquement`;
		var tierRegularPingLabel_Translated = `Serveurs jaunes + rouges`;
		var tierUnlimitedPingLabel_Translated = `Tous les serveurs — vert, jaune et rouge`;
		var tierBasicFeat1_Translated = `Serveurs ping rouge`;
		var tierBasicFeat2_Translated = `Toutes les régions principales`;
		var tierBasicFeat3_Translated = `Ping plus élevé (~150ms+)`;
		var tierRegularFeat1_Translated = `Serveurs ping jaune + rouge`;
		var tierRegularFeat2_Translated = `Plus de régions disponibles`;
		var tierRegularFeat3_Translated = `Ping correct (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Serveurs ping vert + jaune + rouge`;
		var tierUnlimitedFeat2_Translated = `Chaque région débloquée`;
		var tierUnlimitedFeat3_Translated = `Meilleur ping (<80ms)`;
		var gateDescGreen_Translated = `C'est un serveur ping vert. Vous avez besoin du plan Illimité pour le rejoindre.`;
		var gateDescYellow_Translated = `C'est un serveur ping jaune. Vous avez besoin du plan Régulier ou supérieur pour le rejoindre.`;
		var gateDescRed_Translated = `C'est un serveur ping rouge. Vous avez besoin du plan Basique ou supérieur pour le rejoindre.`;
		var perMonth_Translated = `/ mois`;
		var perMonthShort_Translated = `/ mois`;
		var configError_Translated = `Erreur de configuration`;
		var back_Translated = `← Retour`;
		var subscriptionGame_Translated = `Jeu d'abonnement`;
		var notEnoughRobux_Translated = `Vous n'avez pas assez de Robux pour acheter ceci.`;
		var permissionUpdateTitle_Translated = `Mise à Jour du Sélecteur de Région`;
		var permissionUpdateDesc_Translated = `RoRegion utilise désormais notre API backend pour une vitesse améliorée, plus de localisations de serveurs et des régions élargies incluant le Brésil et plus encore. Accordez l'accès ci-dessous pour continuer.`;
		var permissionWelcomeTitle_Translated = `Bienvenue sur RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion vous donne le contrôle total sur le serveur Roblox que vous rejoignez — choisissez par région, consultez les estimations de ping et trouvez le meilleur serveur pour votre connexion. Accordez l'accès ci-dessous pour commencer.`;
		var permissionAgree_Translated = `Accepter et Continuer`;
		var permissionWhatsNew_Translated = `Nouveautés`;
		var permissionGotIt_Translated = `Compris — Allons-y`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Une autorisation unique est requise pour se connecter à l'API RoRegion.`;
		var planSuffix_Translated = `Forfait`;
		var feat1Name_Translated = `Régions de Serveur`;
		var feat1Desc_Translated = `Parcourez les serveurs groupés par région — Singapour, États-Unis, UE, Brésil et plus.`;
		var feat2Name_Translated = `Estimations de Ping`;
		var feat2Desc_Translated = `Voyez le ping estimé de chaque serveur avant de vous connecter.`;
		var feat3Name_Translated = `Rejoindre un Serveur Directement`;
		var feat3Desc_Translated = `Rejoignez directement un serveur spécifique, en ignorant complètement le matchmaker.`;
		var feat4Name_Translated = `Niveaux d'Abonnement`;
		var feat4Desc_Translated = `Débloquez des serveurs à ping plus faible avec les plans Basic, Regular ou Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Les données du serveur transitent désormais par notre propre API pour des temps de chargement plus rapides dans toutes les régions.`;
		var change2Name_Translated = `Plus de Régions`;
		var change2Desc_Translated = `Le Brésil et des emplacements supplémentaires ont été ajoutés au navigateur de serveurs.`;
		var change3Name_Translated = `Plus d'Emplacements de Serveur`;
		var change3Desc_Translated = `Couverture élargie — plus de centres de données spécifiques sont maintenant suivis et affichés.`;
		var change4Name_Translated = `Interface Améliorée`;
		var change4Desc_Translated = `Mise en page du sélecteur de région révisée avec des cartes de serveur plus propres et une meilleure organisation.`;
		var balanceCheckFailed_Translated = `Échec de la vérification du solde. Réessayez.`;
		var purchaseFailed_Translated = `Achat échoué`;
		var unknownError_Translated = `Erreur inconnue. Vérifiez Roblox et réessayez.`;
		var newPlanActive_Translated = `⚠ Nouveau plan actif. L'ancien plan peut nécessiter une annulation manuelle dans les paramètres Roblox.`;

		var joinTheGameToSubscribe_Translated = `Entra nel gioco per abbonarti`;
		var planActivatesInstantly_Translated = `Il tuo piano si attiva istantaneamente dopo l'acquisto nel gioco.`;
		var unlimitedPlanRequired_Translated = `È necessario un piano Illimitato per entrare in questo server. Abbonati nel gioco per sbloccare ogni regione.`;
		var couldNotPreparePurchase_Translated = `Impossibile preparare il piano. Riprova.`;
		var launching_Translated = `✓ Avvio in corso… Completa l'acquisto nel gioco.`;
		var comeBackAfterSubscribing_Translated = `Torna qui dopo l'abbonamento per aggiornare il tuo piano.`;
		var stepPressPlay_Translated = `Premi play`;
		var stepSubscribeInGame_Translated = `Abbonati nel gioco`;
		var stepComeBackRefresh_Translated = `Torna e aggiorna`;
	}
	if (languageCode == 'pl_pl') {
		var serversIn_Translated = `Serwery w`;
		var closeButton_Translated = `Zamknij`;
		var loadMoreServers_Translated = `Załaduj Więcej Serwerów`;
		var serversText_Translated = `SERVER_COUNT serwer`;
		var serversText_Plural_Translated = `SERVER_COUNT serwery`;
		var unknown_Translated = `Nieznany`;
		var unknownLocation_Translated = `Nieznana Lokalizacja`;
		var loading_Translated = `Ładowanie...`;
		var errorLoadingServers_Translated = `Błąd ładowania serwerów. Spróbuj ponownie.`;
		var errorLoadingMore_Translated = `Błąd ładowania więcej serwerów`;
		var noPlayersOnline_Translated = `Brak graczy online`;
		var fetchingMoreServers_Translated = `Pobieranie kolejnych serwerów...`;
		var unknownRegion_Translated = `Nieznany Region`;
		var membershipRequired_Translated = `Wymagane Członkostwo`;
		var planNeeded_Translated = `plan wymagany`;
		var dismiss_Translated = `Odrzuć`;
		var viewMembership_Translated = `Zobacz Członkostwo`;
		var serverLocations_Translated = `Lokalizacje Serwerów`;
		var roregionDashboard_Translated = `Panel RoRegion`;
		var membership_Translated = `Członkostwo`;
		var loadingMembership_Translated = `Ładowanie członkostwa...`;
		var expiring_Translated = `Wygasa`;
		var planActive_Translated = `Aktywny`
		var renewsOn_Translated = `Odnawia się`;
		var expiresOn_Translated = `Wygasa`;;
		var switchPlan_Translated = `Zmień Plan`;
		var bestValue_Translated = `Najlepsza Wartość`;
		var upgrade_Translated = `Ulepsz`;
		var switchTier_Translated = `Zmień`;
		var topTierMessage_Translated = `Jesteś na najwyższym poziomie — nic wyższego niedostępne.`;
		var autoRenews_Translated = `Automatycznie odnawia się co miesiąc przez prywatny serwer Roblox.`;
		var privateServerHosted_Translated = `Prywatny serwer hostowany w tej grze`;
		var monthlyTotal_Translated = `Suma miesięczna`;
		var confirmUpgrade_Translated = `Potwierdź — Ulepsz`;
		var upgradedWelcome_Translated = `✓ Ulepszone! Witaj w`;
		var subscribeYouTube_Translated = `Subskrybuj na YouTube`;
		var subscribeDesc_Translated = `Wspieraj nas i bądź na bieżąco z najnowszymi aktualizacjami!`;
		var disclaimer_Translated = `Ze względu na limity szybkości Roblox i bieżące zmiany platformy, pełne załadowanie wszystkich serwerów może potrwać kilka minut. To poza naszą kontrolą — dziękujemy za cierpliwość.`;
		var noServersRegion_Translated = `Nie znaleziono serwerów w tym regionie. Spróbuj odświeżyć.`;
		var loadingRegions_Translated = `Ładowanie regionów...`;
		var noServersFound_Translated = `Nie znaleziono serwerów. Spróbuj odświeżyć.`;
		var noActiveServers_Translated = `Nie znaleziono aktywnych serwerów w tym regionie.`;
		var playersCount_Translated = `graczy`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Subskrybuj`;
		var tierBasicLabel_Translated = `Podstawowy`;
		var tierRegularLabel_Translated = `Regularny`;
		var tierUnlimitedLabel_Translated = `Nieograniczony`;
		var tierBasicDesc_Translated = `Świetne na początek — dostęp do wszystkich serwerów czerwonego pingu w każdym regionie.`;
		var tierRegularDesc_Translated = `Przejdź do serwerów żółtego pingu dla wyraźnie lepszych czasów odpowiedzi.`;
		var tierUnlimitedDesc_Translated = `Pełna sieć — każdy region, każdy serwer, najniższy możliwy ping.`;
		var tierBasicPingLabel_Translated = `Tylko czerwone serwery`;
		var tierRegularPingLabel_Translated = `Żółte + czerwone serwery`;
		var tierUnlimitedPingLabel_Translated = `Wszystkie serwery — zielone, żółte i czerwone`;
		var tierBasicFeat1_Translated = `Serwery czerwonego pingu`;
		var tierBasicFeat2_Translated = `Wszystkie główne regiony`;
		var tierBasicFeat3_Translated = `Wyższy ping (~150ms+)`;
		var tierRegularFeat1_Translated = `Serwery żółtego + czerwonego pingu`;
		var tierRegularFeat2_Translated = `Więcej dostępnych regionów`;
		var tierRegularFeat3_Translated = `Stabilny ping (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Serwery zielonego + żółtego + czerwonego pingu`;
		var tierUnlimitedFeat2_Translated = `Każdy region odblokowany`;
		var tierUnlimitedFeat3_Translated = `Najlepszy ping (<80ms)`;
		var gateDescGreen_Translated = `To jest serwer zielonego pingu. Potrzebujesz planu Nieograniczonego, aby dołączyć.`;
		var gateDescYellow_Translated = `To jest serwer żółtego pingu. Potrzebujesz planu Regularnego lub wyższego, aby dołączyć.`;
		var gateDescRed_Translated = `To jest serwer czerwonego pingu. Potrzebujesz planu Podstawowego lub wyższego, aby dołączyć.`;
		var perMonth_Translated = `/ miesiąc`;
		var perMonthShort_Translated = `/ mies.`;
		var configError_Translated = `Błąd konfiguracji`;
		var back_Translated = `← Wstecz`;
		var subscriptionGame_Translated = `Gra subskrypcyjna`;
		var notEnoughRobux_Translated = `Nie masz wystarczającej liczby Robuxów, aby to kupić.`;
		var permissionUpdateTitle_Translated = `Aktualizacja Selektora Regionu`;
		var permissionUpdateDesc_Translated = `RoRegion teraz używa naszego API backend dla poprawionej szybkości, więcej lokalizacji serwerów i rozszerzonych regionów w tym Brazylii i innych. Przyznaj dostęp poniżej, aby kontynuować.`;
		var permissionWelcomeTitle_Translated = `Witaj w RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion daje ci pełną kontrolę nad tym, do którego serwera Roblox dołączasz — wybieraj według regionu, sprawdzaj szacunki pingu i znajdź najlepszy serwer dla swojego połączenia. Przyznaj dostęp poniżej, aby zacząć.`;
		var permissionAgree_Translated = `Zgódź się i Kontynuuj`;
		var permissionWhatsNew_Translated = `Co nowego`;
		var permissionGotIt_Translated = `Rozumiem — Zaczynajmy`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Jednorazowe uprawnienie jest wymagane do połączenia z API RoRegion.`;
		var planSuffix_Translated = `Plan`;
		var feat1Name_Translated = `Regiony Serwerów`;
		var feat1Desc_Translated = `Przeglądaj serwery pogrupowane według regionu — Singapur, USA, UE, Brazylia i inne.`;
		var feat2Name_Translated = `Szacunki Pingu`;
		var feat2Desc_Translated = `Sprawdź szacowany ping każdego serwera przed dołączeniem.`;
		var feat3Name_Translated = `Bezpośrednie Dołączanie do Serwera`;
		var feat3Desc_Translated = `Wejdź bezpośrednio na konkretny serwer, całkowicie omijając matchmaker.`;
		var feat4Name_Translated = `Poziomy Członkostwa`;
		var feat4Desc_Translated = `Odblokuj serwery z niższym pingiem dzięki planom Basic, Regular lub Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Dane serwera są teraz kierowane przez nasze własne API dla szybszego ładowania we wszystkich regionach.`;
		var change2Name_Translated = `Więcej Regionów`;
		var change2Desc_Translated = `Brazylia i dodatkowe lokalizacje zostały dodane do przeglądarki serwerów.`;
		var change3Name_Translated = `Więcej Lokalizacji Serwerów`;
		var change3Desc_Translated = `Rozszerzone pokrycie — więcej konkretnych centrów danych jest teraz śledzonych i wyświetlanych.`;
		var change4Name_Translated = `Ulepszone UI`;
		var change4Desc_Translated = `Odświeżony układ selektora regionów z czystszymi kartami serwerów i lepszą organizacją.`;
		var balanceCheckFailed_Translated = `Sprawdzenie salda nie powiodło się. Spróbuj ponownie.`;
		var purchaseFailed_Translated = `Zakup nie powiódł się`;
		var unknownError_Translated = `Nieznany błąd. Sprawdź Roblox i spróbuj ponownie.`;
		var newPlanActive_Translated = `⚠ Nowy plan aktywny. Stary plan może wymagać ręcznego anulowania w ustawieniach Roblox.`;
		var joinTheGameToSubscribe_Translated = `Dołącz do gry, aby subskrybować`;
		var planActivatesInstantly_Translated = `Twój plan aktywuje się natychmiast po zakupie w grze.`;
		var unlimitedPlanRequired_Translated = `Aby dołączyć do tego serwera, wymagany jest plan Nieograniczony. Subskrybuj w grze, aby odblokować każdy region.`;
		var couldNotPreparePurchase_Translated = `Nie można przygotować zakupu. Spróbuj ponownie.`;
		var launching_Translated = `✓ Uruchamianie… Zakończ zakup w grze.`;
		var comeBackAfterSubscribing_Translated = `Wróć tutaj po subskrypcji, aby odświeżyć swój plan.`;
		var stepPressPlay_Translated = `Naciśnij play`;
		var stepSubscribeInGame_Translated = `Subskrybuj w grze`;
		var stepComeBackRefresh_Translated = `Wróć i odśwież`;
	}
		if (languageCode == 'pt_br') {
		var serversIn_Translated = `Servidores em`;
		var closeButton_Translated = `Fechar`;
		var loadMoreServers_Translated = `Carregar Mais Servidores`;
		var serversText_Translated = `SERVER_COUNT servidor`;
		var serversText_Plural_Translated = `SERVER_COUNT servidores`;
		var unknown_Translated = `Desconhecido`;
		var unknownLocation_Translated = `Localização Desconhecida`;
		var loading_Translated = `Carregando...`;
		var errorLoadingServers_Translated = `Erro ao carregar servidores. Tente novamente.`;
		var errorLoadingMore_Translated = `Erro ao carregar mais servidores`;
		var noPlayersOnline_Translated = `Nenhum jogador online`;
		var fetchingMoreServers_Translated = `Buscando mais servidores...`;
		var unknownRegion_Translated = `Região Desconhecida`;
		var membershipRequired_Translated = `Assinatura Necessária`;
		var planNeeded_Translated = `plano necessário`;
		var dismiss_Translated = `Dispensar`;
		var viewMembership_Translated = `Ver Assinatura`;
		var serverLocations_Translated = `Localizações dos Servidores`;
		var roregionDashboard_Translated = `Painel RoRegion`;
		var membership_Translated = `Assinatura`;
		var loadingMembership_Translated = `Carregando assinatura...`;
		var expiring_Translated = `Expirando`;
		var planActive_Translated = `Ativo`
		var renewsOn_Translated = `Renova em`;
		var expiresOn_Translated = `Expira em`;;
		var switchPlan_Translated = `Trocar Plano`;
		var bestValue_Translated = `Melhor Custo-Benefício`;
		var upgrade_Translated = `Melhorar`;
		var switchTier_Translated = `Trocar`;
		var topTierMessage_Translated = `Você está no nível mais alto — nada superior disponível.`;
		var autoRenews_Translated = `Renovação automática mensal via servidor privado do Roblox.`;
		var privateServerHosted_Translated = `Servidor privado hospedado neste jogo`;
		var monthlyTotal_Translated = `Total mensal`;
		var confirmUpgrade_Translated = `Confirmar — Melhorar`;
		var upgradedWelcome_Translated = `✓ Melhorado! Bem-vindo ao`;
		var subscribeYouTube_Translated = `Inscreva-se no YouTube`;
		var subscribeDesc_Translated = `Apoie-nos e fique por dentro das últimas atualizações!`;
		var disclaimer_Translated = `Devido aos limites de taxa do Roblox e mudanças contínuas na plataforma, pode levar alguns minutos para todos os servidores carregarem completamente. Isso está fora do nosso controle — obrigado pela paciência.`;
		var noServersRegion_Translated = `Nenhum servidor encontrado nesta região. Tente atualizar.`;
		var loadingRegions_Translated = `Carregando regiões...`;
		var noServersFound_Translated = `Nenhum servidor encontrado. Tente atualizar.`;
		var noActiveServers_Translated = `Nenhum servidor ativo encontrado nesta região.`;
		var playersCount_Translated = `jogadores`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Inscrever-se`;
		var tierBasicLabel_Translated = `Básico`;
		var tierRegularLabel_Translated = `Regular`;
		var tierUnlimitedLabel_Translated = `Ilimitado`;
		var tierBasicDesc_Translated = `Ótimo para começar — acesse todos os servidores de ping vermelho em cada região.`;
		var tierRegularDesc_Translated = `Avance para servidores de ping amarelo para tempos de resposta notavelmente melhores.`;
		var tierUnlimitedDesc_Translated = `A rede completa — cada região, cada servidor, o menor ping possível.`;
		var tierBasicPingLabel_Translated = `Apenas servidores vermelhos`;
		var tierRegularPingLabel_Translated = `Servidores amarelos + vermelhos`;
		var tierUnlimitedPingLabel_Translated = `Todos os servidores — verde, amarelo e vermelho`;
		var tierBasicFeat1_Translated = `Servidores de ping vermelho`;
		var tierBasicFeat2_Translated = `Todas as regiões principais`;
		var tierBasicFeat3_Translated = `Ping mais alto (~150ms+)`;
		var tierRegularFeat1_Translated = `Servidores de ping amarelo + vermelho`;
		var tierRegularFeat2_Translated = `Mais regiões disponíveis`;
		var tierRegularFeat3_Translated = `Ping sólido (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Servidores de ping verde + amarelo + vermelho`;
		var tierUnlimitedFeat2_Translated = `Cada região desbloqueada`;
		var tierUnlimitedFeat3_Translated = `Melhor ping (<80ms)`;
		var gateDescGreen_Translated = `Este é um servidor de ping verde. Você precisa do plano Ilimitado para entrar.`;
		var gateDescYellow_Translated = `Este é um servidor de ping amarelo. Você precisa do plano Regular ou superior para entrar.`;
		var gateDescRed_Translated = `Este é um servidor de ping vermelho. Você precisa do plano Básico ou superior para entrar.`;
		var perMonth_Translated = `/ mês`;
		var perMonthShort_Translated = `/ mês`;
		var configError_Translated = `Erro de configuração`;
		var back_Translated = `← Voltar`;
		var subscriptionGame_Translated = `Jogo de assinatura`;
		var notEnoughRobux_Translated = `Você não tem Robux suficientes para comprar isso.`;
		var permissionUpdateTitle_Translated = `Atualização do Seletor de Região`;
		var permissionUpdateDesc_Translated = `RoRegion agora usa nossa API de backend para velocidade melhorada, mais localizações de servidores e regiões expandidas incluindo o Brasil e mais. Conceda acesso abaixo para continuar.`;
		var permissionWelcomeTitle_Translated = `Bem-vindo ao RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion te dá controle total sobre qual servidor Roblox você entra — escolha por região, veja estimativas de ping e encontre o melhor servidor para sua conexão. Conceda acesso abaixo para começar.`;
		var permissionAgree_Translated = `Aceitar e Continuar`;
		var permissionWhatsNew_Translated = `O que há de novo`;
		var permissionGotIt_Translated = `Entendido — Vamos lá`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Uma permissão única é necessária para se conectar à API do RoRegion.`;
		var planSuffix_Translated = `Plano`;
		var feat1Name_Translated = `Regiões de Servidor`;
		var feat1Desc_Translated = `Navegue por servidores agrupados por região — Singapura, EUA, UE, Brasil e mais.`;
		var feat2Name_Translated = `Estimativas de Ping`;
		var feat2Desc_Translated = `Veja o ping estimado de cada servidor antes de entrar.`;
		var feat3Name_Translated = `Entrar Diretamente no Servidor`;
		var feat3Desc_Translated = `Entre diretamente em um servidor específico, pulando completamente o matchmaker.`;
		var feat4Name_Translated = `Níveis de Assinatura`;
		var feat4Desc_Translated = `Desbloqueie servidores com ping mais baixo com os planos Basic, Regular ou Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Os dados do servidor agora passam pela nossa própria API para tempos de carregamento mais rápidos em todas as regiões.`;
		var change2Name_Translated = `Mais Regiões`;
		var change2Desc_Translated = `Brasil e locais adicionais foram adicionados ao navegador de servidores.`;
		var change3Name_Translated = `Mais Locais de Servidor`;
		var change3Desc_Translated = `Cobertura expandida — mais centros de dados específicos agora são rastreados e exibidos.`;
		var change4Name_Translated = `UI Melhorada`;
		var change4Desc_Translated = `Layout do seletor de região atualizado com cartões de servidor mais limpos e melhor organização.`;
		var balanceCheckFailed_Translated = `Falha na verificação de saldo. Tente novamente.`;
		var purchaseFailed_Translated = `Compra falhou`;
		var unknownError_Translated = `Erro desconhecido. Verifique o Roblox e tente novamente.`;
		var newPlanActive_Translated = `⚠ Novo plano ativo. O plano antigo pode precisar de cancelamento manual nas configurações do Roblox.`;

		var joinTheGameToSubscribe_Translated = `Entre no jogo para assinar`;
		var planActivatesInstantly_Translated = `Seu plano é ativado instantaneamente após a compra dentro do jogo.`;
		var unlimitedPlanRequired_Translated = `É necessário um plano Ilimitado para entrar neste servidor. Assine no jogo para desbloquear todas as regiões.`;
		var couldNotPreparePurchase_Translated = `Não foi possível preparar a compra. Tente novamente.`;
		var launching_Translated = `✓ Iniciando… Conclua a compra no jogo.`;
		var comeBackAfterSubscribing_Translated = `Volte aqui após assinar para atualizar seu plano.`;
		var stepPressPlay_Translated = `Pressionar play`;
		var stepSubscribeInGame_Translated = `Assinar no jogo`;
		var stepComeBackRefresh_Translated = `Voltar e atualizar`;
	}
		if (languageCode == 'vi_vn') {
		var serversIn_Translated = `Máy chủ tại`;
		var closeButton_Translated = `Đóng`;
		var loadMoreServers_Translated = `Tải thêm Máy chủ`;
		var serversText_Translated = `SERVER_COUNT máy chủ`;
		var serversText_Plural_Translated = `SERVER_COUNT máy chủ`;
		var unknown_Translated = `Không xác định`;
		var unknownLocation_Translated = `Vị trí Không xác định`;
		var loading_Translated = `Đang tải...`;
		var errorLoadingServers_Translated = `Lỗi khi tải máy chủ. Vui lòng thử lại.`;
		var errorLoadingMore_Translated = `Lỗi khi tải thêm máy chủ`;
		var noPlayersOnline_Translated = `Không có người chơi trực tuyến`;
		var fetchingMoreServers_Translated = `Đang tải thêm máy chủ...`;
		var unknownRegion_Translated = `Khu vực Không xác định`;
		var membershipRequired_Translated = `Yêu cầu Thành viên`;
		var planNeeded_Translated = `gói cần thiết`;
		var dismiss_Translated = `Bỏ qua`;
		var viewMembership_Translated = `Xem Thành viên`;
		var serverLocations_Translated = `Vị trí Máy chủ`;
		var roregionDashboard_Translated = `Bảng điều khiển RoRegion`;
		var membership_Translated = `Thành viên`;
		var loadingMembership_Translated = `Đang tải thành viên...`;
		var expiring_Translated = `Sắp hết hạn`;
		var planActive_Translated = `Đang hoạt động`
		var renewsOn_Translated = `Gia hạn ngày`;
		var expiresOn_Translated = `Hết hạn ngày`;;
		var switchPlan_Translated = `Chuyển Gói`;
		var bestValue_Translated = `Tốt nhất`;
		var upgrade_Translated = `Nâng cấp`;
		var switchTier_Translated = `Chuyển`;
		var topTierMessage_Translated = `Bạn đang ở cấp cao nhất — không có gì cao hơn.`;
		var autoRenews_Translated = `Tự động gia hạn hàng tháng qua máy chủ riêng tư Roblox.`;
		var privateServerHosted_Translated = `Máy chủ riêng được lưu trữ trên game này`;
		var monthlyTotal_Translated = `Tổng hàng tháng`;
		var confirmUpgrade_Translated = `Xác nhận — Nâng cấp`;
		var upgradedWelcome_Translated = `✓ Đã nâng cấp! Chào mừng đến`;
		var subscribeYouTube_Translated = `Đăng ký trên YouTube`;
		var subscribeDesc_Translated = `Ủng hộ chúng tôi và cập nhật các bản cập nhật mới nhất!`;
		var disclaimer_Translated = `Do giới hạn tốc độ của Roblox và các thay đổi nền tảng, có thể mất vài phút để tất cả máy chủ tải đầy đủ. Điều này nằm ngoài tầm kiểm soát của chúng tôi — cảm ơn sự kiên nhẫn của bạn.`;
		var noServersRegion_Translated = `Không tìm thấy máy chủ trong khu vực này. Hãy thử làm mới.`;
		var loadingRegions_Translated = `Đang tải khu vực...`;
		var noServersFound_Translated = `Không tìm thấy máy chủ. Hãy thử làm mới.`;
		var noActiveServers_Translated = `Không tìm thấy máy chủ hoạt động trong khu vực này.`;
		var playersCount_Translated = `người chơi`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Đăng ký`;
		var tierBasicLabel_Translated = `Cơ bản`;
		var tierRegularLabel_Translated = `Thông thường`;
		var tierUnlimitedLabel_Translated = `Không giới hạn`;
		var tierBasicDesc_Translated = `Tuyệt vời để bắt đầu — truy cập tất cả máy chủ ping đỏ ở mọi khu vực.`;
		var tierRegularDesc_Translated = `Nâng cấp lên máy chủ ping vàng để có thời gian phản hồi tốt hơn đáng kể.`;
		var tierUnlimitedDesc_Translated = `Mạng lưới đầy đủ — mọi khu vực, mọi máy chủ, ping thấp nhất có thể.`;
		var tierBasicPingLabel_Translated = `Chỉ máy chủ đỏ`;
		var tierRegularPingLabel_Translated = `Máy chủ vàng + đỏ`;
		var tierUnlimitedPingLabel_Translated = `Tất cả máy chủ — xanh, vàng & đỏ`;
		var tierBasicFeat1_Translated = `Máy chủ ping đỏ`;
		var tierBasicFeat2_Translated = `Tất cả khu vực cốt lõi`;
		var tierBasicFeat3_Translated = `Ping cao hơn (~150ms+)`;
		var tierRegularFeat1_Translated = `Máy chủ ping vàng + đỏ`;
		var tierRegularFeat2_Translated = `Có thêm nhiều khu vực`;
		var tierRegularFeat3_Translated = `Ping ổn định (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Máy chủ ping xanh + vàng + đỏ`;
		var tierUnlimitedFeat2_Translated = `Mọi khu vực được mở khóa`;
		var tierUnlimitedFeat3_Translated = `Ping tốt nhất (<80ms)`;
		var gateDescGreen_Translated = `Đây là máy chủ ping xanh. Bạn cần gói Không giới hạn để tham gia.`;
		var gateDescYellow_Translated = `Đây là máy chủ ping vàng. Bạn cần gói Thông thường hoặc cao hơn để tham gia.`;
		var gateDescRed_Translated = `Đây là máy chủ ping đỏ. Bạn cần gói Cơ bản hoặc cao hơn để tham gia.`;
		var perMonth_Translated = `/ tháng`;
		var perMonthShort_Translated = `/ tháng`;
		var configError_Translated = `Lỗi cấu hình`;
		var back_Translated = `← Quay lại`;
		var subscriptionGame_Translated = `Trò chơi đăng ký`;
		var notEnoughRobux_Translated = `Bạn không có đủ Robux để mua thứ này.`;
		var permissionUpdateTitle_Translated = `Cập Nhật Bộ Chọn Khu Vực`;
		var permissionUpdateDesc_Translated = `RoRegion hiện sử dụng API backend của chúng tôi để cải thiện tốc độ, thêm vị trí máy chủ và mở rộng khu vực bao gồm Brazil và nhiều hơn nữa. Cấp quyền truy cập bên dưới để tiếp tục.`;
		var permissionWelcomeTitle_Translated = `Chào Mừng đến với RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion cho bạn toàn quyền kiểm soát máy chủ Roblox bạn tham gia — chọn theo khu vực, xem ước tính ping và tìm máy chủ tốt nhất cho kết nối của bạn. Cấp quyền truy cập bên dưới để bắt đầu.`;
		var permissionAgree_Translated = `Đồng Ý & Tiếp Tục`;
		var permissionWhatsNew_Translated = `Có Gì Mới`;
		var permissionGotIt_Translated = `Hiểu rồi — Bắt Đầu Thôi`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `Cần cấp quyền một lần để kết nối với API RoRegion.`;
		var planSuffix_Translated = `Gói`;
		var feat1Name_Translated = `Khu Vực Máy Chủ`;
		var feat1Desc_Translated = `Duyệt máy chủ theo khu vực — Singapore, Mỹ, EU, Brazil và nhiều hơn nữa.`;
		var feat2Name_Translated = `Ước Tính Ping`;
		var feat2Desc_Translated = `Xem ping ước tính của mỗi máy chủ trước khi tham gia.`;
		var feat3Name_Translated = `Tham Gia Máy Chủ Trực Tiếp`;
		var feat3Desc_Translated = `Vào thẳng một máy chủ cụ thể, bỏ qua hoàn toàn hệ thống ghép đôi.`;
		var feat4Name_Translated = `Cấp Độ Thành Viên`;
		var feat4Desc_Translated = `Mở khóa máy chủ ping thấp hơn với các gói Basic, Regular hoặc Unlimited.`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `Dữ liệu máy chủ hiện được định tuyến qua API của chúng tôi để tải nhanh hơn ở tất cả các khu vực.`;
		var change2Name_Translated = `Thêm Khu Vực`;
		var change2Desc_Translated = `Brazil và các địa điểm bổ sung đã được thêm vào trình duyệt máy chủ.`;
		var change3Name_Translated = `Thêm Vị Trí Máy Chủ`;
		var change3Desc_Translated = `Phạm vi mở rộng — nhiều trung tâm dữ liệu cụ thể hơn hiện được theo dõi và hiển thị.`;
		var change4Name_Translated = `Giao Diện Được Cải Thiện`;
		var change4Desc_Translated = `Bố cục bộ chọn khu vực được làm mới với thẻ máy chủ gọn gàng hơn và tổ chức tốt hơn.`;
		var balanceCheckFailed_Translated = `Kiểm tra số dư thất bại. Thử lại.`;
		var purchaseFailed_Translated = `Mua hàng thất bại`;
		var unknownError_Translated = `Lỗi không xác định. Kiểm tra Roblox và thử lại.`;
		var newPlanActive_Translated = `⚠ Gói mới đã hoạt động. Gói cũ có thể cần hủy thủ công trong cài đặt Roblox.`;

		var joinTheGameToSubscribe_Translated = `Tham gia trò chơi để đăng ký`;
		var planActivatesInstantly_Translated = `Gói của bạn được kích hoạt ngay lập tức sau khi mua trong trò chơi.`;
		var unlimitedPlanRequired_Translated = `Cần có gói Không Giới Hạn để tham gia máy chủ này. Đăng ký trong trò chơi để mở khóa mọi khu vực.`;
		var couldNotPreparePurchase_Translated = `Không thể chuẩn bị mua hàng. Thử lại.`;
		var launching_Translated = `✓ Đang khởi động… Hoàn thành mua hàng trong trò chơi.`;
		var comeBackAfterSubscribing_Translated = `Quay lại đây sau khi đăng ký để làm mới gói của bạn.`;
		var stepPressPlay_Translated = `Nhấn play`;
		var stepSubscribeInGame_Translated = `Đăng ký trong trò chơi`;
		var stepComeBackRefresh_Translated = `Quay lại & làm mới`;
	}
		if (languageCode == 'tr_tr') {
		var serversIn_Translated = `Sunucular`;
		var closeButton_Translated = `Kapat`;
		var loadMoreServers_Translated = `Daha Fazla Sunucu Yükle`;
		var serversText_Translated = `SERVER_COUNT sunucu`;
		var serversText_Plural_Translated = `SERVER_COUNT sunucu`;
		var unknown_Translated = `Bilinmeyen`;
		var unknownLocation_Translated = `Bilinmeyen Konum`;
		var loading_Translated = `Yükleniyor...`;
		var errorLoadingServers_Translated = `Sunucular yüklenirken hata. Lütfen tekrar deneyin.`;
		var errorLoadingMore_Translated = `Daha fazla sunucu yüklenirken hata`;
		var noPlayersOnline_Translated = `Çevrimiçi oyuncu yok`;
		var fetchingMoreServers_Translated = `Daha fazla sunucu alınıyor...`;
		var unknownRegion_Translated = `Bilinmeyen Bölge`;
		var membershipRequired_Translated = `Üyelik Gerekli`;
		var planNeeded_Translated = `plan gerekli`;
		var dismiss_Translated = `Kapat`;
		var viewMembership_Translated = `Üyeliği Görüntüle`;
		var serverLocations_Translated = `Sunucu Konumları`;
		var roregionDashboard_Translated = `RoRegion Paneli`;
		var membership_Translated = `Üyelik`;
		var loadingMembership_Translated = `Üyelik yükleniyor...`;
		var expiring_Translated = `Süresi Doluyor`;
		var planActive_Translated = `Aktif`;
		var switchPlan_Translated = `Planı Değiştir`;
		var bestValue_Translated = `En İyi Değer`;
		var upgrade_Translated = `Yükselt`;
		var switchTier_Translated = `Değiştir`;
		var topTierMessage_Translated = `En yüksek kademedekisiniz — daha yüksek bir şey mevcut değil.`;
		var autoRenews_Translated = `Roblox özel sunucusu üzerinden aylık otomatik yenilenir.`;
		var privateServerHosted_Translated = `Bu oyunda barındırılan özel sunucu`;
		var monthlyTotal_Translated = `Aylık toplam`;
		var confirmUpgrade_Translated = `Onayla — Yükselt`;
		var upgradedWelcome_Translated = `✓ Yükseltildi! Hoş geldiniz`;
		var subscribeYouTube_Translated = `YouTube'da Abone Ol`;
		var subscribeDesc_Translated = `Bizi destekleyin ve en son güncellemelerden haberdar olun!`;
		var disclaimer_Translated = `Roblox'un hız sınırları ve devam eden platform değişiklikleri nedeniyle tüm sunucuların tamamen yüklenmesi birkaç dakika sürebilir. Bu bizim kontrolümüz dışında — sabrınız için teşekkürler.`;
		var noServersRegion_Translated = `Bu bölgede sunucu bulunamadı. Yenilemeyi deneyin.`;
		var loadingRegions_Translated = `Bölgeler yükleniyor...`;
		var noServersFound_Translated = `Sunucu bulunamadı. Yenilemeyi deneyin.`;
		var noActiveServers_Translated = `Bu bölgede aktif sunucu bulunamadı.`;
		var playersCount_Translated = `oyuncu`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `Abone Ol`;
		var tierBasicLabel_Translated = `Temel`;
		var tierRegularLabel_Translated = `Standart`;
		var tierUnlimitedLabel_Translated = `Sınırsız`;
		var tierBasicDesc_Translated = `Başlamak için harika — her bölgedeki tüm kırmızı ping sunucularına erişin.`;
		var tierRegularDesc_Translated = `Belirgin biçimde daha iyi yanıt süreleri için sarı ping sunucularına geçin.`;
		var tierUnlimitedDesc_Translated = `Tam ağ — her bölge, her sunucu, mümkün olan en düşük ping.`;
		var tierBasicPingLabel_Translated = `Yalnızca kırmızı sunucular`;
		var tierRegularPingLabel_Translated = `Sarı + kırmızı sunucular`;
		var tierUnlimitedPingLabel_Translated = `Tüm sunucular — yeşil, sarı ve kırmızı`;
		var tierBasicFeat1_Translated = `Kırmızı ping sunucuları`;
		var tierBasicFeat2_Translated = `Tüm temel bölgeler`;
		var tierBasicFeat3_Translated = `Daha yüksek ping (~150ms+)`;
		var tierRegularFeat1_Translated = `Sarı + kırmızı ping sunucuları`;
		var tierRegularFeat2_Translated = `Daha fazla bölge mevcut`;
		var tierRegularFeat3_Translated = `Kararlı ping (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `Yeşil + sarı + kırmızı ping sunucuları`;
		var tierUnlimitedFeat2_Translated = `Her bölge kilidi açık`;
		var tierUnlimitedFeat3_Translated = `En iyi ping (<80ms)`;
		var gateDescGreen_Translated = `Bu yeşil ping sunucusudur. Katılmak için Sınırsız plana ihtiyacınız var.`;
		var gateDescYellow_Translated = `Bu sarı ping sunucusudur. Katılmak için Standart veya daha yüksek plana ihtiyacınız var.`;
		var gateDescRed_Translated = `Bu kırmızı ping sunucusudur. Katılmak için Temel veya daha yüksek plana ihtiyacınız var.`;
		var perMonth_Translated = `/ ay`;
		var perMonthShort_Translated = `/ ay`;
		var configError_Translated = `Yapılandırma hatası`;
		var back_Translated = `← Geri`;
		var subscriptionGame_Translated = `Abonelik Oyunu`;
		var notEnoughRobux_Translated = `Bunu satın almak için yeterli Robux'unuz yok.`;
		var permissionUpdateTitle_Translated = `Bölge Seçici Güncellemesi`;
		var permissionUpdateDesc_Translated = `RoRegion artık geliştirilmiş hız, daha fazla sunucu konumu ve Brezilya dahil daha fazlasını kapsayan genişletilmiş bölgeler için arka uç API'mizi kullanıyor. Devam etmek için aşağıdan erişim izni ver.`;
		var permissionWelcomeTitle_Translated = `RoRegion'a Hoş Geldiniz`;
		var permissionWelcomeDesc_Translated = `RoRegion, hangi Roblox sunucusuna katılacağınız üzerinde tam kontrol sağlar — bölgeye göre seçin, ping tahminlerini görün ve bağlantınız için en iyi sunucuyu bulun. Başlamak için aşağıdan erişim izni ver.`;
		var permissionAgree_Translated = `Kabul Et ve Devam Et`;
		var permissionWhatsNew_Translated = `Yenilikler`;
		var permissionGotIt_Translated = `Anladım — Hadi Başlayalım`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `RoRegion API'sine bağlanmak için bir kerelik izin gereklidir.`;
		var planSuffix_Translated = `Plan`;
		var feat1Name_Translated = `Sunucu Bölgeleri`;
		var feat1Desc_Translated = `Sunucuları bölgeye göre göz atın — Singapur, ABD, AB, Brezilya ve daha fazlası.`;
		var feat2Name_Translated = `Ping Tahminleri`;
		var feat2Desc_Translated = `Katılmadan önce her sunucunun tahmini pingini görün.`;
		var feat3Name_Translated = `Doğrudan Sunucuya Katılma`;
		var feat3Desc_Translated = `Doğrudan belirli bir sunucuya girin, eşleştiriciyi tamamen atlayın.`;
		var feat4Name_Translated = `Üyelik Seviyeleri`;
		var feat4Desc_Translated = `Basic, Regular veya Unlimited planlarıyla daha düşük ping sunucularının kilidini açın.`;
		var change1Name_Translated = `Backend API`;
		var change1Desc_Translated = `Sunucu verileri artık tüm bölgelerde daha hızlı yükleme süreleri için kendi API'miz üzerinden yönlendiriliyor.`;
		var change2Name_Translated = `Daha Fazla Bölge`;
		var change2Desc_Translated = `Brezilya ve ek konumlar sunucu tarayıcısına eklendi.`;
		var change3Name_Translated = `Daha Fazla Sunucu Konumu`;
		var change3Desc_Translated = `Genişletilmiş kapsam — daha fazla spesifik veri merkezi artık izleniyor ve görüntüleniyor.`;
		var change4Name_Translated = `Geliştirilmiş Arayüz`;
		var change4Desc_Translated = `Daha temiz sunucu kartları ve daha iyi organizasyonla yenilenmiş bölge seçici düzeni.`;
		var balanceCheckFailed_Translated = `Bakiye kontrolü başarısız. Tekrar deneyin.`;
		var purchaseFailed_Translated = `Satın alma başarısız`;
		var unknownError_Translated = `Bilinmeyen hata. Roblox'u kontrol edin ve tekrar deneyin.`;
		var newPlanActive_Translated = `⚠ Yeni plan aktif. Eski planın Roblox ayarlarından manuel olarak iptal edilmesi gerekebilir.`;

		var joinTheGameToSubscribe_Translated = `Abone olmak için oyuna katıl`;
		var planActivatesInstantly_Translated = `Planın, oyun içinde satın aldıktan hemen sonra etkinleşir.`;
		var unlimitedPlanRequired_Translated = `Bu sunucuya katılmak için Sınırsız plan gereklidir. Her bölgenin kilidini açmak için oyun içinde abone ol.`;
		var couldNotPreparePurchase_Translated = `Satın alma hazırlanamadı. Tekrar dene.`;
		var launching_Translated = `✓ Başlatılıyor… Satın almayı oyun içinde tamamla.`;
		var comeBackAfterSubscribing_Translated = `Planını yenilemek için abone olduktan sonra buraya geri dön.`;
		var stepPressPlay_Translated = `Play'e bas`;
		var stepSubscribeInGame_Translated = `Oyun içinde abone ol`;
		var stepComeBackRefresh_Translated = `Geri dön ve yenile`;
	}
		if (languageCode == 'th_th') {
		var serversIn_Translated = `เซิร์ฟเวอร์ใน`;
		var closeButton_Translated = `ปิด`;
		var loadMoreServers_Translated = `โหลดเซิร์ฟเวอร์เพิ่มเติม`;
		var serversText_Translated = `เซิร์ฟเวอร์ SERVER_COUNT เครื่อง`;
		var serversText_Plural_Translated = `เซิร์ฟเวอร์ SERVER_COUNT เครื่อง`;
		var unknown_Translated = `ไม่ทราบ`;
		var unknownLocation_Translated = `ตำแหน่งไม่ทราบ`;
		var loading_Translated = `กำลังโหลด...`;
		var errorLoadingServers_Translated = `ข้อผิดพลาดในการโหลดเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง`;
		var errorLoadingMore_Translated = `ข้อผิดพลาดในการโหลดเซิร์ฟเวอร์เพิ่มเติม`;
		var noPlayersOnline_Translated = `ไม่มีผู้เล่นออนไลน์`;
		var fetchingMoreServers_Translated = `กำลังดึงข้อมูลเซิร์ฟเวอร์เพิ่มเติม...`;
		var unknownRegion_Translated = `ภูมิภาคไม่ทราบ`;
		var membershipRequired_Translated = `ต้องการสมาชิก`;
		var planNeeded_Translated = `แผนที่ต้องการ`;
		var dismiss_Translated = `ปิด`;
		var viewMembership_Translated = `ดูสมาชิก`;
		var serverLocations_Translated = `ตำแหน่งเซิร์ฟเวอร์`;
		var roregionDashboard_Translated = `แดชบอร์ด RoRegion`;
		var membership_Translated = `สมาชิก`;
		var loadingMembership_Translated = `กำลังโหลดสมาชิก...`;
		var expiring_Translated = `กำลังหมดอายุ`;
		var planActive_Translated = `ใช้งานอยู่`
		var renewsOn_Translated = `ต่ออายุ`;
		var expiresOn_Translated = `หมดอายุ`;;
		var switchPlan_Translated = `เปลี่ยนแผน`;
		var bestValue_Translated = `คุ้มค่าที่สุด`;
		var upgrade_Translated = `อัปเกรด`;
		var switchTier_Translated = `เปลี่ยน`;
		var topTierMessage_Translated = `คุณอยู่ในระดับสูงสุด — ไม่มีระดับที่สูงกว่านี้`;
		var autoRenews_Translated = `ต่ออายุอัตโนมัติทุกเดือนผ่านเซิร์ฟเวอร์ส่วนตัว Roblox`;
		var privateServerHosted_Translated = `เซิร์ฟเวอร์ส่วนตัวที่โฮสต์บนเกมนี้`;
		var monthlyTotal_Translated = `ยอดรวมรายเดือน`;
		var confirmUpgrade_Translated = `ยืนยัน — อัปเกรด`;
		var upgradedWelcome_Translated = `✓ อัปเกรดแล้ว! ยินดีต้อนรับสู่`;
		var subscribeYouTube_Translated = `สมัครสมาชิก YouTube`;
		var subscribeDesc_Translated = `สนับสนุนเราและติดตามการอัปเดตล่าสุด!`;
		var disclaimer_Translated = `เนื่องจากขีดจำกัดความเร็วของ Roblox และการเปลี่ยนแปลงแพลตฟอร์มอย่างต่อเนื่อง อาจใช้เวลาสองสามนาทีกว่าเซิร์ฟเวอร์ทั้งหมดจะโหลดสมบูรณ์ ซึ่งอยู่นอกเหนือการควบคุมของเรา — ขอบคุณสำหรับความอดทน`;
		var noServersRegion_Translated = `ไม่พบเซิร์ฟเวอร์ในภูมิภาคนี้ ลองรีเฟรช`;
		var loadingRegions_Translated = `กำลังโหลดภูมิภาค...`;
		var noServersFound_Translated = `ไม่พบเซิร์ฟเวอร์ ลองรีเฟรช`;
		var noActiveServers_Translated = `ไม่พบเซิร์ฟเวอร์ที่ใช้งานอยู่ในภูมิภาคนี้`;
		var playersCount_Translated = `ผู้เล่น`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `ติดตาม`;
		var tierBasicLabel_Translated = `พื้นฐาน`;
		var tierRegularLabel_Translated = `มาตรฐาน`;
		var tierUnlimitedLabel_Translated = `ไม่จำกัด`;
		var tierBasicDesc_Translated = `เหมาะสำหรับการเริ่มต้น — เข้าถึงเซิร์ฟเวอร์ปิงแดงทั้งหมดในทุกภูมิภาค`;
		var tierRegularDesc_Translated = `อัปเกรดเป็นเซิร์ฟเวอร์ปิงเหลืองเพื่อเวลาตอบสนองที่ดีขึ้นอย่างเห็นได้ชัด`;
		var tierUnlimitedDesc_Translated = `เครือข่ายครบวงจร — ทุกภูมิภาค ทุกเซิร์ฟเวอร์ ปิงต่ำสุดที่เป็นไปได้`;
		var tierBasicPingLabel_Translated = `เซิร์ฟเวอร์สีแดงเท่านั้น`;
		var tierRegularPingLabel_Translated = `เซิร์ฟเวอร์สีเหลือง + แดง`;
		var tierUnlimitedPingLabel_Translated = `เซิร์ฟเวอร์ทั้งหมด — เขียว เหลือง & แดง`;
		var tierBasicFeat1_Translated = `เซิร์ฟเวอร์ปิงแดง`;
		var tierBasicFeat2_Translated = `ทุกภูมิภาคหลัก`;
		var tierBasicFeat3_Translated = `ปิงสูงกว่า (~150ms+)`;
		var tierRegularFeat1_Translated = `เซิร์ฟเวอร์ปิงเหลือง + แดง`;
		var tierRegularFeat2_Translated = `มีภูมิภาคเพิ่มเติม`;
		var tierRegularFeat3_Translated = `ปิงเสถียร (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `เซิร์ฟเวอร์ปิงเขียว + เหลือง + แดง`;
		var tierUnlimitedFeat2_Translated = `ปลดล็อกทุกภูมิภาค`;
		var tierUnlimitedFeat3_Translated = `ปิงดีที่สุด (<80ms)`;
		var gateDescGreen_Translated = `นี่คือเซิร์ฟเวอร์ปิงเขียว คุณต้องการแผน ไม่จำกัด เพื่อเข้าร่วม`;
		var gateDescYellow_Translated = `นี่คือเซิร์ฟเวอร์ปิงเหลือง คุณต้องการแผน มาตรฐาน หรือสูงกว่าเพื่อเข้าร่วม`;
		var gateDescRed_Translated = `นี่คือเซิร์ฟเวอร์ปิงแดง คุณต้องการแผน พื้นฐาน หรือสูงกว่าเพื่อเข้าร่วม`;
		var perMonth_Translated = `/ เดือน`;
		var perMonthShort_Translated = `/ เดือน`;
		var configError_Translated = `ข้อผิดพลาดการกำหนดค่า`;
		var back_Translated = `← กลับ`;
		var subscriptionGame_Translated = `เกมสมาชิก`;
		var notEnoughRobux_Translated = `คุณมี Robux ไม่เพียงพอสำหรับการซื้อนี้`;
		var permissionUpdateTitle_Translated = `อัปเดต Region Selector`;
		var permissionUpdateDesc_Translated = `RoRegion ใช้ backend API ของเราเพื่อความเร็วที่ดีขึ้น ตำแหน่งเซิร์ฟเวอร์เพิ่มเติม และภูมิภาคที่ขยายรวมถึงบราซิลและอื่น ๆ อนุญาตการเข้าถึงด้านล่างเพื่อดำเนินการต่อ`;
		var permissionWelcomeTitle_Translated = `ยินดีต้อนรับสู่ RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion ให้คุณควบคุมเซิร์ฟเวอร์ Roblox ที่คุณเข้าร่วมได้อย่างเต็มที่ — เลือกตามภูมิภาค ดูการประมาณ ping และค้นหาเซิร์ฟเวอร์ที่ดีที่สุดสำหรับการเชื่อมต่อของคุณ อนุญาตการเข้าถึงด้านล่างเพื่อเริ่มต้น`;
		var permissionAgree_Translated = `ยอมรับและดำเนินการต่อ`;
		var permissionWhatsNew_Translated = `มีอะไรใหม่`;
		var permissionGotIt_Translated = `เข้าใจแล้ว — เริ่มเลย`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `ต้องได้รับอนุญาตครั้งเดียวเพื่อเชื่อมต่อกับ API RoRegion`;
		var planSuffix_Translated = `แผน`;
		var feat1Name_Translated = `ภูมิภาคเซิร์ฟเวอร์`;
		var feat1Desc_Translated = `เรียกดูเซิร์ฟเวอร์ตามภูมิภาค — สิงคโปร์, สหรัฐอเมริกา, EU, บราซิล และอื่นๆ`;
		var feat2Name_Translated = `การประมาณค่า Ping`;
		var feat2Desc_Translated = `ดูค่า ping โดยประมาณของทุกเซิร์ฟเวอร์ก่อนเข้าร่วม`;
		var feat3Name_Translated = `เข้าร่วมเซิร์ฟเวอร์โดยตรง`;
		var feat3Desc_Translated = `เข้าร่วมเซิร์ฟเวอร์เฉพาะโดยตรง ข้าม matchmaker ทั้งหมด`;
		var feat4Name_Translated = `ระดับสมาชิก`;
		var feat4Desc_Translated = `ปลดล็อกเซิร์ฟเวอร์ที่มี ping ต่ำกว่าด้วยแผน Basic, Regular หรือ Unlimited`;
		var change1Name_Translated = `API Backend`;
		var change1Desc_Translated = `ข้อมูลเซิร์ฟเวอร์ตอนนี้ถูกส่งผ่าน API ของเราเองเพื่อเวลาโหลดที่เร็วขึ้นในทุกภูมิภาค`;
		var change2Name_Translated = `ภูมิภาคเพิ่มเติม`;
		var change2Desc_Translated = `บราซิลและสถานที่เพิ่มเติมถูกเพิ่มเข้าในเบราว์เซอร์เซิร์ฟเวอร์`;
		var change3Name_Translated = `สถานที่เซิร์ฟเวอร์เพิ่มเติม`;
		var change3Desc_Translated = `การครอบคลุมที่ขยายออกไป — ตอนนี้มีการติดตามและแสดงศูนย์ข้อมูลเฉพาะเพิ่มเติม`;
		var change4Name_Translated = `UI ที่ได้รับการปรับปรุง`;
		var change4Desc_Translated = `เลย์เอาต์ตัวเลือกภูมิภาคที่ได้รับการปรับปรุงใหม่พร้อมการ์ดเซิร์ฟเวอร์ที่สะอาดกว่าและการจัดระเบียบที่ดีขึ้น`;
		var balanceCheckFailed_Translated = `การตรวจสอบยอดเงินล้มเหลว ลองอีกครั้ง`;
		var purchaseFailed_Translated = `การซื้อล้มเหลว`;
		var unknownError_Translated = `ข้อผิดพลาดที่ไม่รู้จัก ตรวจสอบ Roblox และลองอีกครั้ง`;
		var newPlanActive_Translated = `⚠ แผนใหม่ใช้งานได้แล้ว แผนเก่าอาจต้องยกเลิกด้วยตนเองในการตั้งค่า Roblox`;

		var joinTheGameToSubscribe_Translated = `เข้าร่วมเกมเพื่อสมัครสมาชิก`;
		var planActivatesInstantly_Translated = `แผนของคุณจะเปิดใช้งานทันทีหลังจากซื้อในเกม`;
		var unlimitedPlanRequired_Translated = `ต้องใช้แผน Unlimited เพื่อเข้าร่วมเซิร์ฟเวอร์นี้ สมัครสมาชิกในเกมเพื่อปลดล็อกทุกภูมิภาค`;
		var couldNotPreparePurchase_Translated = `ไม่สามารถเตรียมการซื้อได้ ลองอีกครั้ง`;
		var launching_Translated = `✓ กำลังเปิด… ทำการซื้อให้เสร็จในเกม`;
		var comeBackAfterSubscribing_Translated = `กลับมาที่นี่หลังสมัครสมาชิกเพื่อรีเฟรชแผนของคุณ`;
		var stepPressPlay_Translated = `กดเล่น`;
		var stepSubscribeInGame_Translated = `สมัครสมาชิกในเกม`;
		var stepComeBackRefresh_Translated = `กลับมาและรีเฟรช`;
	}
		if (languageCode == 'zh_cn') {
		var serversIn_Translated = `服务器位于`;
		var closeButton_Translated = `关闭`;
		var loadMoreServers_Translated = `加载更多服务器`;
		var serversText_Translated = `SERVER_COUNT 台服务器`;
		var serversText_Plural_Translated = `SERVER_COUNT 台服务器`;
		var unknown_Translated = `未知`;
		var unknownLocation_Translated = `未知位置`;
		var loading_Translated = `加载中...`;
		var errorLoadingServers_Translated = `加载服务器时出错。请重试。`;
		var errorLoadingMore_Translated = `加载更多服务器时出错`;
		var noPlayersOnline_Translated = `没有在线玩家`;
		var fetchingMoreServers_Translated = `正在获取更多服务器...`;
		var unknownRegion_Translated = `未知区域`;
		var membershipRequired_Translated = `需要会员资格`;
		var planNeeded_Translated = `需要方案`;
		var dismiss_Translated = `关闭`;
		var viewMembership_Translated = `查看会员资格`;
		var serverLocations_Translated = `服务器位置`;
		var roregionDashboard_Translated = `RoRegion 控制台`;
		var membership_Translated = `会员资格`;
		var loadingMembership_Translated = `正在加载会员资格...`;
		var expiring_Translated = `即将到期`;
		var planActive_Translated = `活跃`;
		var renewsOn_Translated = `续订于`;
		var expiresOn_Translated = `到期于`;
		var switchPlan_Translated = `切换方案`;
		var bestValue_Translated = `最佳性价比`;
		var upgrade_Translated = `升级`;
		var switchTier_Translated = `切换`;
		var topTierMessage_Translated = `您已是最高等级 — 没有更高级别。`;
		var autoRenews_Translated = `通过 Roblox 私人服务器每月自动续费。`;
		var privateServerHosted_Translated = `托管在此游戏上的私人服务器`;
		var monthlyTotal_Translated = `每月总计`;
		var confirmUpgrade_Translated = `确认 — 升级`;
		var upgradedWelcome_Translated = `✓ 已升级！欢迎加入`;
		var subscribeYouTube_Translated = `在 YouTube 上订阅`;
		var subscribeDesc_Translated = `支持我们，及时获取最新更新！`;
		var disclaimer_Translated = `由于 Roblox 的速率限制和持续的平台变化，所有服务器完全加载可能需要几分钟。这不在我们的控制范围内 — 感谢您的耐心。`;
		var noServersRegion_Translated = `在此区域未找到服务器。请尝试刷新。`;
		var loadingRegions_Translated = `正在加载区域...`;
		var noServersFound_Translated = `未找到服务器。请尝试刷新。`;
		var noActiveServers_Translated = `在此区域未找到活跃服务器。`;
		var playersCount_Translated = `玩家`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `订阅`;
		var tierBasicLabel_Translated = `基础`;
		var tierRegularLabel_Translated = `标准`;
		var tierUnlimitedLabel_Translated = `无限`;
		var tierBasicDesc_Translated = `非常适合入门 — 可访问每个地区的所有红色延迟服务器。`;
		var tierRegularDesc_Translated = `升级到黄色延迟服务器，获得明显更好的响应时间。`;
		var tierUnlimitedDesc_Translated = `完整网络 — 每个地区、每台服务器、尽可能低的延迟。`;
		var tierBasicPingLabel_Translated = `仅红色服务器`;
		var tierRegularPingLabel_Translated = `黄色 + 红色服务器`;
		var tierUnlimitedPingLabel_Translated = `所有服务器 — 绿色、黄色和红色`;
		var tierBasicFeat1_Translated = `红色延迟服务器`;
		var tierBasicFeat2_Translated = `所有核心地区`;
		var tierBasicFeat3_Translated = `较高延迟（~150ms+）`;
		var tierRegularFeat1_Translated = `黄色 + 红色延迟服务器`;
		var tierRegularFeat2_Translated = `更多地区可用`;
		var tierRegularFeat3_Translated = `稳定延迟（~80–150ms）`;
		var tierUnlimitedFeat1_Translated = `绿色 + 黄色 + 红色延迟服务器`;
		var tierUnlimitedFeat2_Translated = `每个地区均已解锁`;
		var tierUnlimitedFeat3_Translated = `最佳延迟（<80ms）`;
		var gateDescGreen_Translated = `这是绿色延迟服务器，加入需要无限计划。`;
		var gateDescYellow_Translated = `这是黄色延迟服务器，加入需要标准计划或更高级别。`;
		var gateDescRed_Translated = `这是红色延迟服务器，加入需要基础计划或更高级别。`;
		var perMonth_Translated = `/ 月`;
		var perMonthShort_Translated = `/ 月`;
		var configError_Translated = `配置错误`;
		var back_Translated = `← 返回`;
		var subscriptionGame_Translated = `订阅游戏`;
		var notEnoughRobux_Translated = `您没有足够的Robux购买此内容。`;
		var permissionUpdateTitle_Translated = `区域选择器更新`;
		var permissionUpdateDesc_Translated = `RoRegion 现在使用我们的后端 API 来提高速度、更多服务器位置以及扩展的区域（包括巴西等）。在下方授予访问权限以继续。`;
		var permissionWelcomeTitle_Translated = `欢迎使用 RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion 让您完全控制加入哪个 Roblox 服务器 — 按地区选择、查看延迟估算，并找到最适合您网络连接的服务器。在下方授予访问权限以开始使用。`;
		var permissionAgree_Translated = `同意并继续`;
		var permissionWhatsNew_Translated = `新功能`;
		var permissionGotIt_Translated = `明白了 — 出发`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `需要一次性权限才能连接到 RoRegion API。`;
		var planSuffix_Translated = `计划`;
		var feat1Name_Translated = `服务器地区`;
		var feat1Desc_Translated = `按地区浏览服务器 — 新加坡、美国、欧盟、巴西等。`;
		var feat2Name_Translated = `延迟估算`;
		var feat2Desc_Translated = `在加入之前查看每个服务器的估算延迟。`;
		var feat3Name_Translated = `直接加入服务器`;
		var feat3Desc_Translated = `直接进入特定服务器，完全跳过匹配系统。`;
		var feat4Name_Translated = `会员等级`;
		var feat4Desc_Translated = `使用基础版、常规版或无限版计划解锁延迟更低的服务器。`;
		var change1Name_Translated = `后端 API`;
		var change1Desc_Translated = `服务器数据现在通过我们自己的 API 路由，以便在所有地区实现更快的加载时间。`;
		var change2Name_Translated = `更多地区`;
		var change2Desc_Translated = `巴西和其他位置已添加到服务器浏览器中。`;
		var change3Name_Translated = `更多服务器位置`;
		var change3Desc_Translated = `覆盖范围扩大 — 现在可以跟踪和显示更多特定数据中心。`;
		var change4Name_Translated = `改进的界面`;
		var change4Desc_Translated = `刷新了地区选择器布局，服务器卡片更简洁，组织更清晰。`;
		var balanceCheckFailed_Translated = `余额检查失败。请重试。`;
		var purchaseFailed_Translated = `购买失败`;
		var unknownError_Translated = `未知错误。请检查 Roblox 并重试。`;
		var newPlanActive_Translated = `⚠ 新计划已激活。旧计划可能需要在 Roblox 设置中手动取消。`;

		var joinTheGameToSubscribe_Translated = `加入游戏以订阅`;
		var planActivatesInstantly_Translated = `在游戏内购买后，您的计划将立即激活。`;
		var unlimitedPlanRequired_Translated = `加入此服务器需要无限计划。在游戏内订阅以解锁每个区域。`;
		var couldNotPreparePurchase_Translated = `无法准备购买。请重试。`;
		var launching_Translated = `✓ 正在启动……请在游戏内完成购买。`;
		var comeBackAfterSubscribing_Translated = `订阅后请返回此处以刷新您的计划。`;
		var stepPressPlay_Translated = `按下播放`;
		var stepSubscribeInGame_Translated = `在游戏内订阅`;
		var stepComeBackRefresh_Translated = `返回并刷新`;
	}
	if (languageCode == 'zh_tw') {
		var serversIn_Translated = `伺服器位於`;
		var closeButton_Translated = `關閉`;
		var loadMoreServers_Translated = `載入更多伺服器`;
		var serversText_Translated = `SERVER_COUNT 台伺服器`;
		var serversText_Plural_Translated = `SERVER_COUNT 台伺服器`;
		var unknown_Translated = `未知`;
		var unknownLocation_Translated = `未知位置`;
		var loading_Translated = `載入中...`;
		var errorLoadingServers_Translated = `載入伺服器時出錯。請重試。`;
		var errorLoadingMore_Translated = `載入更多伺服器時出錯`;
		var noPlayersOnline_Translated = `沒有線上玩家`;
		var fetchingMoreServers_Translated = `正在獲取更多伺服器...`;
		var unknownRegion_Translated = `未知區域`;
		var membershipRequired_Translated = `需要會員資格`;
		var planNeeded_Translated = `需要方案`;
		var dismiss_Translated = `關閉`;
		var viewMembership_Translated = `查看會員資格`;
		var serverLocations_Translated = `伺服器位置`;
		var roregionDashboard_Translated = `RoRegion 控制台`;
		var membership_Translated = `會員資格`;
		var loadingMembership_Translated = `正在載入會員資格...`;
		var expiring_Translated = `即將到期`;
		var planActive_Translated = `活躍`;
		var renewsOn_Translated = `續訂於`;
		var expiresOn_Translated = `到期於`;
		var switchPlan_Translated = `切換方案`;
		var bestValue_Translated = `最佳性價比`;
		var upgrade_Translated = `升級`;
		var switchTier_Translated = `切換`;
		var topTierMessage_Translated = `您已是最高等級 — 沒有更高級別。`;
		var autoRenews_Translated = `通過 Roblox 私人伺服器每月自動續費。`;
		var privateServerHosted_Translated = `託管在此遊戲上的私人伺服器`;
		var monthlyTotal_Translated = `每月總計`;
		var confirmUpgrade_Translated = `確認 — 升級`;
		var upgradedWelcome_Translated = `✓ 已升級！歡迎加入`;
		var subscribeYouTube_Translated = `在 YouTube 上訂閱`;
		var subscribeDesc_Translated = `支持我們，及時獲取最新更新！`;
		var disclaimer_Translated = `由於 Roblox 的速率限制和持續的平台變化，所有伺服器完全載入可能需要幾分鐘。這不在我們的控制範圍內 — 感謝您的耐心。`;
		var noServersRegion_Translated = `在此區域未找到伺服器。請嘗試重新整理。`;
		var loadingRegions_Translated = `正在載入區域...`;
		var noServersFound_Translated = `未找到伺服器。請嘗試重新整理。`;
		var noActiveServers_Translated = `在此區域未找到活躍伺服器。`;
		var playersCount_Translated = `玩家`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `訂閱`;
		var tierBasicLabel_Translated = `基礎`;
		var tierRegularLabel_Translated = `標準`;
		var tierUnlimitedLabel_Translated = `無限`;
		var tierBasicDesc_Translated = `非常適合入門 — 可存取每個地區的所有紅色延遲伺服器。`;
		var tierRegularDesc_Translated = `升級到黃色延遲伺服器，獲得明顯更好的回應時間。`;
		var tierUnlimitedDesc_Translated = `完整網路 — 每個地區、每台伺服器、盡可能低的延遲。`;
		var tierBasicPingLabel_Translated = `僅紅色伺服器`;
		var tierRegularPingLabel_Translated = `黃色 + 紅色伺服器`;
		var tierUnlimitedPingLabel_Translated = `所有伺服器 — 綠色、黃色和紅色`;
		var tierBasicFeat1_Translated = `紅色延遲伺服器`;
		var tierBasicFeat2_Translated = `所有核心地區`;
		var tierBasicFeat3_Translated = `較高延遲（~150ms+）`;
		var tierRegularFeat1_Translated = `黃色 + 紅色延遲伺服器`;
		var tierRegularFeat2_Translated = `更多地區可用`;
		var tierRegularFeat3_Translated = `穩定延遲（~80–150ms）`;
		var tierUnlimitedFeat1_Translated = `綠色 + 黃色 + 紅色延遲伺服器`;
		var tierUnlimitedFeat2_Translated = `每個地區均已解鎖`;
		var tierUnlimitedFeat3_Translated = `最佳延遲（<80ms）`;
		var gateDescGreen_Translated = `這是綠色延遲伺服器，加入需要無限計劃。`;
		var gateDescYellow_Translated = `這是黃色延遲伺服器，加入需要標準計劃或更高級別。`;
		var gateDescRed_Translated = `這是紅色延遲伺服器，加入需要基礎計劃或更高級別。`;
		var perMonth_Translated = `/ 月`;
		var perMonthShort_Translated = `/ 月`;
		var configError_Translated = `設定錯誤`;
		var back_Translated = `← 返回`;
		var subscriptionGame_Translated = `訂閱遊戲`;
		var notEnoughRobux_Translated = `您沒有足夠的Robux購買此內容。`;
		var permissionUpdateTitle_Translated = `區域選擇器更新`;
		var permissionUpdateDesc_Translated = `RoRegion 現在使用我們的後端 API 來提高速度、更多伺服器位置以及擴展的區域（包括巴西等）。在下方授予存取權限以繼續。`;
		var permissionWelcomeTitle_Translated = `歡迎使用 RoRegion`;
		var permissionWelcomeDesc_Translated = `RoRegion 讓您完全控制加入哪個 Roblox 伺服器 — 按地區選擇、查看延遲估算，並找到最適合您網路連線的伺服器。在下方授予存取權限以開始使用。`;
		var permissionAgree_Translated = `同意並繼續`;
		var permissionWhatsNew_Translated = `新功能`;
		var permissionGotIt_Translated = `明白了 — 出發`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `需要一次性權限才能連接到 RoRegion API。`;
		var planSuffix_Translated = `計劃`;
		var feat1Name_Translated = `伺服器地區`;
		var feat1Desc_Translated = `按地區瀏覽伺服器 — 新加坡、美國、歐盟、巴西等。`;
		var feat2Name_Translated = `延遲估算`;
		var feat2Desc_Translated = `在加入之前查看每個伺服器的估算延遲。`;
		var feat3Name_Translated = `直接加入伺服器`;
		var feat3Desc_Translated = `直接進入特定伺服器，完全跳過配對系統。`;
		var feat4Name_Translated = `會員等級`;
		var feat4Desc_Translated = `使用基礎版、常規版或無限版計劃解鎖延遲更低的伺服器。`;
		var change1Name_Translated = `後端 API`;
		var change1Desc_Translated = `伺服器數據現在通過我們自己的 API 路由，以便在所有地區實現更快的加載時間。`;
		var change2Name_Translated = `更多地區`;
		var change2Desc_Translated = `巴西和其他位置已添加到伺服器瀏覽器中。`;
		var change3Name_Translated = `更多伺服器位置`;
		var change3Desc_Translated = `覆蓋範圍擴大 — 現在可以追蹤和顯示更多特定數據中心。`;
		var change4Name_Translated = `改進的介面`;
		var change4Desc_Translated = `刷新了地區選擇器佈局，伺服器卡片更簡潔，組織更清晰。`;
		var balanceCheckFailed_Translated = `餘額檢查失敗。請重試。`;
		var purchaseFailed_Translated = `購買失敗`;
		var unknownError_Translated = `未知錯誤。請檢查 Roblox 並重試。`;
		var newPlanActive_Translated = `⚠ 新計劃已激活。舊計劃可能需要在 Roblox 設定中手動取消。`;

		var joinTheGameToSubscribe_Translated = `加入遊戲以訂閱`;
		var planActivatesInstantly_Translated = `在遊戲內購買後，您的方案將立即啟用。`;
		var unlimitedPlanRequired_Translated = `加入此伺服器需要無限方案。在遊戲內訂閱以解鎖每個地區。`;
		var couldNotPreparePurchase_Translated = `無法準備購買。請重試。`;
		var launching_Translated = `✓ 正在啟動……請在遊戲內完成購買。`;
		var comeBackAfterSubscribing_Translated = `訂閱後請返回此處以重新整理您的方案。`;
		var stepPressPlay_Translated = `按下播放`;
		var stepSubscribeInGame_Translated = `在遊戲內訂閱`;
		var stepComeBackRefresh_Translated = `返回並重新整理`;
	}
		if (languageCode == 'ja_jp') {
		var serversIn_Translated = `サーバーの場所`;
		var closeButton_Translated = `閉じる`;
		var loadMoreServers_Translated = `もっとサーバーをロード`;
		var serversText_Translated = `SERVER_COUNT サーバー`;
		var serversText_Plural_Translated = `SERVER_COUNT サーバー`;
		var unknown_Translated = `不明`;
		var unknownLocation_Translated = `不明な場所`;
		var loading_Translated = `読み込み中...`;
		var errorLoadingServers_Translated = `サーバーの読み込みエラー。もう一度お試しください。`;
		var errorLoadingMore_Translated = `より多くのサーバーの読み込みエラー`;
		var noPlayersOnline_Translated = `オンラインプレイヤーなし`;
		var fetchingMoreServers_Translated = `さらにサーバーを取得中...`;
		var unknownRegion_Translated = `不明なリージョン`;
		var membershipRequired_Translated = `メンバーシップが必要`;
		var planNeeded_Translated = `プランが必要`;
		var dismiss_Translated = `閉じる`;
		var viewMembership_Translated = `メンバーシップを見る`;
		var serverLocations_Translated = `サーバーの場所`;
		var roregionDashboard_Translated = `RoRegion ダッシュボード`;
		var membership_Translated = `メンバーシップ`;
		var loadingMembership_Translated = `メンバーシップを読み込み中...`;
		var expiring_Translated = `もうすぐ終了`;
		var planActive_Translated = `アクティブ`;
		var renewsOn_Translated = `更新日`;
		var expiresOn_Translated = `有効期限`;
		var switchPlan_Translated = `プランを変更`;
		var bestValue_Translated = `最高のコスパ`;
		var upgrade_Translated = `アップグレード`;
		var switchTier_Translated = `変更`;
		var topTierMessage_Translated = `最上位プランです — それ以上のプランはありません。`;
		var autoRenews_Translated = `Roblox プライベートサーバー経由で毎月自動更新。`;
		var privateServerHosted_Translated = `このゲームにホストされたプライベートサーバー`;
		var monthlyTotal_Translated = `月額合計`;
		var confirmUpgrade_Translated = `確認 — アップグレード`;
		var upgradedWelcome_Translated = `✓ アップグレード完了！ようこそ`;
		var subscribeYouTube_Translated = `YouTubeでチャンネル登録`;
		var subscribeDesc_Translated = `サポートして最新情報をゲットしよう！`;
		var disclaimer_Translated = `Robloxのレート制限と継続的なプラットフォームの変更により、すべてのサーバーが完全に読み込まれるまで数分かかる場合があります。これは私たちのコントロール外です — ご理解ありがとうございます。`;
		var noServersRegion_Translated = `このリージョンにサーバーが見つかりません。更新してみてください。`;
		var loadingRegions_Translated = `リージョンを読み込み中...`;
		var noServersFound_Translated = `サーバーが見つかりません。更新してみてください。`;
		var noActiveServers_Translated = `このリージョンにアクティブなサーバーが見つかりません。`;
		var playersCount_Translated = `プレイヤー`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `登録する`;
		var tierBasicLabel_Translated = `ベーシック`;
		var tierRegularLabel_Translated = `レギュラー`;
		var tierUnlimitedLabel_Translated = `アンリミテッド`;
		var tierBasicDesc_Translated = `始めるのに最適 — 全地域の赤ピングサーバーすべてにアクセスできます。`;
		var tierRegularDesc_Translated = `黄色ピングサーバーにアップグレードして、明らかに良い応答時間を手に入れましょう。`;
		var tierUnlimitedDesc_Translated = `完全なネットワーク — 全地域、全サーバー、可能な限り低いping。`;
		var tierBasicPingLabel_Translated = `赤サーバーのみ`;
		var tierRegularPingLabel_Translated = `黄色 + 赤サーバー`;
		var tierUnlimitedPingLabel_Translated = `全サーバー — 緑、黄色＆赤`;
		var tierBasicFeat1_Translated = `赤ピングサーバー`;
		var tierBasicFeat2_Translated = `すべてのコア地域`;
		var tierBasicFeat3_Translated = `高めのping（~150ms+）`;
		var tierRegularFeat1_Translated = `黄色 + 赤ピングサーバー`;
		var tierRegularFeat2_Translated = `さらに多くの地域が利用可能`;
		var tierRegularFeat3_Translated = `安定したping（~80–150ms）`;
		var tierUnlimitedFeat1_Translated = `緑 + 黄色 + 赤ピングサーバー`;
		var tierUnlimitedFeat2_Translated = `全地域アンロック`;
		var tierUnlimitedFeat3_Translated = `最高のping（<80ms）`;
		var gateDescGreen_Translated = `これは緑ピングサーバーです。参加するにはアンリミテッドプランが必要です。`;
		var gateDescYellow_Translated = `これは黄色ピングサーバーです。参加するにはレギュラープラン以上が必要です。`;
		var gateDescRed_Translated = `これは赤ピングサーバーです。参加するにはベーシックプラン以上が必要です。`;
		var perMonth_Translated = `/ 月`;
		var perMonthShort_Translated = `/ 月`;
		var configError_Translated = `設定エラー`;
		var back_Translated = `← 戻る`;
		var subscriptionGame_Translated = `サブスクリプションゲーム`;
		var notEnoughRobux_Translated = `これを購入するためのRobuxが不足しています。`;
		var permissionUpdateTitle_Translated = `リージョンセレクター更新`;
		var permissionUpdateDesc_Translated = `RoRegionはバックエンドAPIを使用して速度向上、サーバー位置の追加、ブラジルなどを含む地域の拡張を実現しました。続けるには以下でアクセスを許可してください。`;
		var permissionWelcomeTitle_Translated = `RoRegionへようこそ`;
		var permissionWelcomeDesc_Translated = `RoRegionを使えば、参加するRobloxサーバーを完全に管理できます — 地域で選択し、ping予測を確認して、接続に最適なサーバーを見つけましょう。始めるには以下でアクセスを許可してください。`;
		var permissionAgree_Translated = `同意して続ける`;
		var permissionWhatsNew_Translated = `新機能`;
		var permissionGotIt_Translated = `わかった — 始めよう`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `RoRegion APIに接続するには、一度限りの許可が必要です。`;
		var planSuffix_Translated = `プラン`;
		var feat1Name_Translated = `サーバー地域`;
		var feat1Desc_Translated = `地域別にサーバーを閲覧 — シンガポール、米国、EU、ブラジルなど。`;
		var feat2Name_Translated = `Ping推定`;
		var feat2Desc_Translated = `参加前に各サーバーの推定Pingを確認できます。`;
		var feat3Name_Translated = `サーバーへの直接参加`;
		var feat3Desc_Translated = `マッチメーカーを完全にスキップして、特定のサーバーに直接入ります。`;
		var feat4Name_Translated = `メンバーシップティア`;
		var feat4Desc_Translated = `Basic、Regular、またはUnlimitedプランで低Pingサーバーをアンロック。`;
		var change1Name_Translated = `バックエンドAPI`;
		var change1Desc_Translated = `サーバーデータが独自のAPIを経由するようになり、全地域での読み込みが高速化。`;
		var change2Name_Translated = `地域の追加`;
		var change2Desc_Translated = `ブラジルと追加の地域がサーバーブラウザに追加されました。`;
		var change3Name_Translated = `サーバー場所の追加`;
		var change3Desc_Translated = `カバレッジが拡大 — より多くの特定のデータセンターが追跡・表示されるようになりました。`;
		var change4Name_Translated = `UIの改善`;
		var change4Desc_Translated = `クリーンなサーバーカードとより良い整理でリージョンセレクターのレイアウトを刷新。`;
		var balanceCheckFailed_Translated = `残高確認に失敗しました。もう一度お試しください。`;
		var purchaseFailed_Translated = `購入に失敗しました`;
		var unknownError_Translated = `不明なエラーです。Robloxを確認して再試行してください。`;
		var newPlanActive_Translated = `⚠ 新しいプランが有効になりました。古いプランはRobloxの設定で手動でキャンセルする必要がある場合があります。`;

		var joinTheGameToSubscribe_Translated = `ゲームに参加して購読する`;
		var planActivatesInstantly_Translated = `ゲーム内で購入後、すぐにプランが有効になります。`;
		var unlimitedPlanRequired_Translated = `このサーバーに参加するには無制限プランが必要です。ゲーム内でサブスクライブして、すべての地域を解放してください。`;
		var couldNotPreparePurchase_Translated = `購入の準備ができませんでした。もう一度お試しください。`;
		var launching_Translated = `✓ 起動中… ゲーム内で購入を完了してください。`;
		var comeBackAfterSubscribing_Translated = `サブスクライブ後、ここに戻ってプランを更新してください。`;
		var stepPressPlay_Translated = `プレイを押す`;
		var stepSubscribeInGame_Translated = `ゲーム内でサブスクライブ`;
		var stepComeBackRefresh_Translated = `戻って更新`;
	}
		if (languageCode == 'ko_kr') {
		var serversIn_Translated = `서버 위치`;
		var closeButton_Translated = `닫기`;
		var loadMoreServers_Translated = `더 많은 서버 로드`;
		var serversText_Translated = `SERVER_COUNT 서버`;
		var serversText_Plural_Translated = `SERVER_COUNT 서버`;
		var unknown_Translated = `알 수 없음`;
		var unknownLocation_Translated = `알 수 없는 위치`;
		var loading_Translated = `로딩 중...`;
		var errorLoadingServers_Translated = `서버 로딩 오류. 다시 시도해주세요.`;
		var errorLoadingMore_Translated = `더 많은 서버 로딩 오류`;
		var noPlayersOnline_Translated = `온라인 플레이어 없음`;
		var fetchingMoreServers_Translated = `더 많은 서버를 가져오는 중...`;
		var unknownRegion_Translated = `알 수 없는 지역`;
		var membershipRequired_Translated = `멤버십 필요`;
		var planNeeded_Translated = `플랜 필요`;
		var dismiss_Translated = `닫기`;
		var viewMembership_Translated = `멤버십 보기`;
		var serverLocations_Translated = `서버 위치`;
		var roregionDashboard_Translated = `RoRegion 대시보드`;
		var membership_Translated = `멤버십`;
		var loadingMembership_Translated = `멤버십 로딩 중...`;
		var expiring_Translated = `만료 예정`;
		var planActive_Translated = `활성`
		var renewsOn_Translated = `갱신일`;
		var expiresOn_Translated = `만료일`;;
		var switchPlan_Translated = `플랜 변경`;
		var bestValue_Translated = `최고 가성비`;
		var upgrade_Translated = `업그레이드`;
		var switchTier_Translated = `변경`;
		var topTierMessage_Translated = `최상위 티어입니다 — 더 높은 티어가 없습니다.`;
		var autoRenews_Translated = `Roblox 프라이빗 서버를 통해 매월 자동 갱신됩니다.`;
		var privateServerHosted_Translated = `이 게임에서 호스팅된 프라이빗 서버`;
		var monthlyTotal_Translated = `월 합계`;
		var confirmUpgrade_Translated = `확인 — 업그레이드`;
		var upgradedWelcome_Translated = `✓ 업그레이드 완료! 환영합니다`;
		var subscribeYouTube_Translated = `YouTube 구독`;
		var subscribeDesc_Translated = `우리를 지원하고 최신 업데이트를 받으세요!`;
		var disclaimer_Translated = `Roblox의 속도 제한과 플랫폼 변경으로 인해 모든 서버가 완전히 로드되는 데 몇 분이 걸릴 수 있습니다. 이는 저희가 통제할 수 없는 부분입니다 — 기다려 주셔서 감사합니다.`;
		var noServersRegion_Translated = `이 지역에서 서버를 찾을 수 없습니다. 새로고침을 시도해 보세요.`;
		var loadingRegions_Translated = `지역 로딩 중...`;
		var noServersFound_Translated = `서버를 찾을 수 없습니다. 새로고침을 시도해 보세요.`;
		var noActiveServers_Translated = `이 지역에서 활성 서버를 찾을 수 없습니다.`;
		var playersCount_Translated = `플레이어`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `구독`;
		var tierBasicLabel_Translated = `베이직`;
		var tierRegularLabel_Translated = `레귤러`;
		var tierUnlimitedLabel_Translated = `언리미티드`;
		var tierBasicDesc_Translated = `시작하기에 최적 — 모든 지역의 빨간 핑 서버에 접근할 수 있습니다.`;
		var tierRegularDesc_Translated = `노란 핑 서버로 업그레이드하여 눈에 띄게 빠른 응답 시간을 경험하세요.`;
		var tierUnlimitedDesc_Translated = `완전한 네트워크 — 모든 지역, 모든 서버, 가능한 가장 낮은 핑.`;
		var tierBasicPingLabel_Translated = `빨간 서버만`;
		var tierRegularPingLabel_Translated = `노란 + 빨간 서버`;
		var tierUnlimitedPingLabel_Translated = `모든 서버 — 초록, 노랑 & 빨강`;
		var tierBasicFeat1_Translated = `빨간 핑 서버`;
		var tierBasicFeat2_Translated = `모든 핵심 지역`;
		var tierBasicFeat3_Translated = `더 높은 핑 (~150ms+)`;
		var tierRegularFeat1_Translated = `노란 + 빨간 핑 서버`;
		var tierRegularFeat2_Translated = `더 많은 지역 이용 가능`;
		var tierRegularFeat3_Translated = `안정적인 핑 (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `초록 + 노란 + 빨간 핑 서버`;
		var tierUnlimitedFeat2_Translated = `모든 지역 잠금 해제`;
		var tierUnlimitedFeat3_Translated = `최상의 핑 (<80ms)`;
		var gateDescGreen_Translated = `이것은 초록 핑 서버입니다. 참가하려면 언리미티드 플랜이 필요합니다.`;
		var gateDescYellow_Translated = `이것은 노란 핑 서버입니다. 참가하려면 레귤러 플랜 이상이 필요합니다.`;
		var gateDescRed_Translated = `이것은 빨간 핑 서버입니다. 참가하려면 베이직 플랜 이상이 필요합니다.`;
		var perMonth_Translated = `/ 월`;
		var perMonthShort_Translated = `/ 월`;
		var configError_Translated = `설정 오류`;
		var back_Translated = `← 뒤로`;
		var subscriptionGame_Translated = `구독 게임`;
		var notEnoughRobux_Translated = `Robux가 부족하여 구매할 수 없습니다.`;
		var permissionUpdateTitle_Translated = `지역 선택기 업데이트`;
		var permissionUpdateDesc_Translated = `RoRegion은 이제 백엔드 API를 사용하여 속도 향상, 더 많은 서버 위치, 브라질 등을 포함한 지역 확장을 제공합니다. 계속하려면 아래에서 액세스를 허용하세요.`;
		var permissionWelcomeTitle_Translated = `RoRegion에 오신 것을 환영합니다`;
		var permissionWelcomeDesc_Translated = `RoRegion을 사용하면 참여할 Roblox 서버를 완전히 제어할 수 있습니다 — 지역별로 선택하고, ping 예측을 확인하고, 연결에 가장 적합한 서버를 찾으세요. 시작하려면 아래에서 액세스를 허용하세요.`;
		var permissionAgree_Translated = `동의하고 계속`;
		var permissionWhatsNew_Translated = `새로운 기능`;
		var permissionGotIt_Translated = `알겠습니다 — 시작하겠습니다`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `RoRegion API에 연결하려면 일회성 권한이 필요합니다.`;
		var planSuffix_Translated = `플랜`;
		var feat1Name_Translated = `서버 지역`;
		var feat1Desc_Translated = `지역별로 서버를 탐색하세요 — 싱가포르, 미국, EU, 브라질 등.`;
		var feat2Name_Translated = `핑 예측`;
		var feat2Desc_Translated = `참가하기 전에 모든 서버의 예상 핑을 확인하세요.`;
		var feat3Name_Translated = `서버 직접 입장`;
		var feat3Desc_Translated = `매치메이커를 완전히 건너뛰고 특정 서버로 바로 입장하세요.`;
		var feat4Name_Translated = `멤버십 등급`;
		var feat4Desc_Translated = `Basic, Regular 또는 Unlimited 플랜으로 낮은 핑 서버를 잠금 해제하세요.`;
		var change1Name_Translated = `백엔드 API`;
		var change1Desc_Translated = `서버 데이터가 이제 모든 지역에서 더 빠른 로드 시간을 위해 자체 API를 통해 라우팅됩니다.`;
		var change2Name_Translated = `더 많은 지역`;
		var change2Desc_Translated = `브라질 및 추가 위치가 서버 브라우저에 추가되었습니다.`;
		var change3Name_Translated = `더 많은 서버 위치`;
		var change3Desc_Translated = `확장된 커버리지 — 더 많은 특정 데이터 센터가 이제 추적되고 표시됩니다.`;
		var change4Name_Translated = `개선된 UI`;
		var change4Desc_Translated = `더 깔끔한 서버 카드와 더 나은 구성으로 지역 선택기 레이아웃이 새로워졌습니다.`;
		var balanceCheckFailed_Translated = `잔액 확인 실패. 다시 시도하세요.`;
		var purchaseFailed_Translated = `구매 실패`;
		var unknownError_Translated = `알 수 없는 오류. Roblox를 확인하고 다시 시도하세요.`;
		var newPlanActive_Translated = `⚠ 새 플랜이 활성화되었습니다. 이전 플랜은 Roblox 설정에서 수동으로 취소해야 할 수 있습니다.`;

		var joinTheGameToSubscribe_Translated = `게임에 참여하여 구독하세요`;
		var planActivatesInstantly_Translated = `게임 내 구매 후 즉시 플랜이 활성화됩니다.`;
		var unlimitedPlanRequired_Translated = `이 서버에 참여하려면 무제한 플랜이 필요합니다. 게임 내에서 구독하여 모든 지역을 잠금 해제하세요.`;
		var couldNotPreparePurchase_Translated = `구매를 준비할 수 없습니다. 다시 시도하세요.`;
		var launching_Translated = `✓ 실행 중… 게임 내에서 구매를 완료하세요.`;
		var comeBackAfterSubscribing_Translated = `구독 후 여기로 돌아와 플랜을 새로 고치세요.`;
		var stepPressPlay_Translated = `플레이 누르기`;
		var stepSubscribeInGame_Translated = `게임 내 구독`;
		var stepComeBackRefresh_Translated = `돌아와서 새로 고침`;
	}
		if (languageCode == 'ar_001') {
		var serversIn_Translated = `خوادم في`;
		var closeButton_Translated = `إغلاق`;
		var loadMoreServers_Translated = `تحميل المزيد من الخوادم`;
		var serversText_Translated = `SERVER_COUNT خادم`;
		var serversText_Plural_Translated = `SERVER_COUNT خادم`;
		var unknown_Translated = `غير معروف`;
		var unknownLocation_Translated = `موقع غير معروف`;
		var loading_Translated = `جاري التحميل...`;
		var errorLoadingServers_Translated = `خطأ في تحميل الخوادم. يرجى المحاولة مرة أخرى.`;
		var errorLoadingMore_Translated = `خطأ في تحميل المزيد من الخوادم`;
		var noPlayersOnline_Translated = `لا يوجد لاعبون متصلون`;
		var fetchingMoreServers_Translated = `جارٍ جلب المزيد من الخوادم...`;
		var unknownRegion_Translated = `منطقة غير معروفة`;
		var membershipRequired_Translated = `الاشتراك مطلوب`;
		var planNeeded_Translated = `الخطة مطلوبة`;
		var dismiss_Translated = `إغلاق`;
		var viewMembership_Translated = `عرض الاشتراك`;
		var serverLocations_Translated = `مواقع الخوادم`;
		var roregionDashboard_Translated = `لوحة تحكم RoRegion`;
		var membership_Translated = `الاشتراك`;
		var loadingMembership_Translated = `جارٍ تحميل الاشتراك...`;
		var expiring_Translated = `ينتهي قريباً`;
		var planActive_Translated = `نشط`
		var renewsOn_Translated = `يتجدد في`;
		var expiresOn_Translated = `ينتهي في`;;
		var switchPlan_Translated = `تغيير الخطة`;
		var bestValue_Translated = `أفضل قيمة`;
		var upgrade_Translated = `ترقية`;
		var switchTier_Translated = `تغيير`;
		var topTierMessage_Translated = `أنت في أعلى مستوى — لا يوجد ما هو أعلى.`;
		var autoRenews_Translated = `يتجدد تلقائيًا شهريًا عبر الخادم الخاص بـ Roblox.`;
		var privateServerHosted_Translated = `خادم خاص مستضاف على هذه اللعبة`;
		var monthlyTotal_Translated = `الإجمالي الشهري`;
		var confirmUpgrade_Translated = `تأكيد — ترقية`;
		var upgradedWelcome_Translated = `✓ تمت الترقية! مرحبًا بك في`;
		var subscribeYouTube_Translated = `اشترك على YouTube`;
		var subscribeDesc_Translated = `ادعمنا وابقَ على اطلاع بآخر التحديثات!`;
		var disclaimer_Translated = `بسبب حدود معدل Roblox والتغييرات المستمرة في المنصة، قد يستغرق تحميل جميع الخوادم بالكامل دقيقتين. هذا خارج عن سيطرتنا — شكرًا لصبرك.`;
		var noServersRegion_Translated = `لم يتم العثور على خوادم في هذه المنطقة. حاول التحديث.`;
		var loadingRegions_Translated = `جاري تحميل المناطق...`;
		var noServersFound_Translated = `لم يتم العثور على خوادم. حاول التحديث.`;
		var noActiveServers_Translated = `لم يتم العثور على خوادم نشطة في هذه المنطقة.`;
		var playersCount_Translated = `لاعبون`;
		var pingUnknown_Translated = `Ping: ?`;
		var subscribe_Translated = `اشترك`;
		var tierBasicLabel_Translated = `أساسي`;
		var tierRegularLabel_Translated = `عادي`;
		var tierUnlimitedLabel_Translated = `غير محدود`;
		var tierBasicDesc_Translated = `رائع للبدء — الوصول إلى جميع خوادم البينج الأحمر في كل منطقة.`;
		var tierRegularDesc_Translated = `انتقل إلى خوادم البينج الأصفر للحصول على أوقات استجابة أفضل بشكل ملحوظ.`;
		var tierUnlimitedDesc_Translated = `الشبكة الكاملة — كل منطقة، كل خادم، أقل بينج ممكن.`;
		var tierBasicPingLabel_Translated = `الخوادم الحمراء فقط`;
		var tierRegularPingLabel_Translated = `الخوادم الصفراء + الحمراء`;
		var tierUnlimitedPingLabel_Translated = `جميع الخوادم — خضراء وصفراء وحمراء`;
		var tierBasicFeat1_Translated = `خوادم البينج الأحمر`;
		var tierBasicFeat2_Translated = `جميع المناطق الأساسية`;
		var tierBasicFeat3_Translated = `بينج أعلى (~150ms+)`;
		var tierRegularFeat1_Translated = `خوادم البينج الأصفر + الأحمر`;
		var tierRegularFeat2_Translated = `المزيد من المناطق متاحة`;
		var tierRegularFeat3_Translated = `بينج مستقر (~80–150ms)`;
		var tierUnlimitedFeat1_Translated = `خوادم البينج الأخضر + الأصفر + الأحمر`;
		var tierUnlimitedFeat2_Translated = `كل منطقة مفتوحة`;
		var tierUnlimitedFeat3_Translated = `أفضل بينج (<80ms)`;
		var gateDescGreen_Translated = `هذا خادم بينج أخضر. تحتاج إلى خطة غير محدود للانضمام.`;
		var gateDescYellow_Translated = `هذا خادم بينج أصفر. تحتاج إلى خطة عادي أو أعلى للانضمام.`;
		var gateDescRed_Translated = `هذا خادم بينج أحمر. تحتاج إلى خطة أساسي أو أعلى للانضمام.`;
		var perMonth_Translated = `/ شهر`;
		var perMonthShort_Translated = `/ شهر`;
		var configError_Translated = `خطأ في الإعداد`;
		var back_Translated = `→ رجوع`;
		var subscriptionGame_Translated = `لعبة الاشتراك`;
		var notEnoughRobux_Translated = `ليس لديك Robux كافٍ لشراء هذا.`;
		var permissionUpdateTitle_Translated = `تحديث محدد المنطقة`;
		var permissionUpdateDesc_Translated = `يستخدم RoRegion الآن واجهة API الخلفية لدينا لتحسين السرعة ومزيد من مواقع الخوادم والمناطق الموسعة بما في ذلك البرازيل والمزيد. امنح الوصول أدناه للمتابعة.`;
		var permissionWelcomeTitle_Translated = `مرحباً بك في RoRegion`;
		var permissionWelcomeDesc_Translated = `يمنحك RoRegion تحكماً كاملاً في الخادم الذي تنضم إليه في Roblox — اختر حسب المنطقة وانظر تقديرات الـ Ping وابحث عن أفضل خادم لاتصالك. امنح الوصول أدناه للبدء.`;
		var permissionAgree_Translated = `موافقة والمتابعة`;
		var permissionWhatsNew_Translated = `ما الجديد`;
		var permissionGotIt_Translated = `فهمت — هيا بنا`;
		var permissionRoRegionLabel_Translated = `RoRegion`;
		var permissionNote_Translated = `يلزم الحصول على إذن لمرة واحدة للاتصال بـ API الخاص بـ RoRegion.`;
		var planSuffix_Translated = `خطة`;
		var feat1Name_Translated = `مناطق الخوادم`;
		var feat1Desc_Translated = `تصفح الخوادم مجمعة حسب المنطقة — سنغافورة، الولايات المتحدة، أوروبا، البرازيل والمزيد.`;
		var feat2Name_Translated = `تقديرات Ping`;
		var feat2Desc_Translated = `اطلع على تقدير Ping لكل خادم قبل الانضمام.`;
		var feat3Name_Translated = `الانضمام المباشر للخادم`;
		var feat3Desc_Translated = `ادخل مباشرة إلى خادم محدد، متجاوزاً نظام المطابقة كلياً.`;
		var feat4Name_Translated = `مستويات العضوية`;
		var feat4Desc_Translated = `افتح خوادم ذات Ping أقل مع خطط Basic أو Regular أو Unlimited.`;
		var change1Name_Translated = `API الخلفية`;
		var change1Desc_Translated = `تُوجَّه بيانات الخادم الآن عبر API الخاص بنا لأوقات تحميل أسرع في جميع المناطق.`;
		var change2Name_Translated = `مناطق إضافية`;
		var change2Desc_Translated = `تمت إضافة البرازيل ومواقع إضافية إلى متصفح الخوادم.`;
		var change3Name_Translated = `مواقع خوادم إضافية`;
		var change3Desc_Translated = `تغطية موسعة — يتم الآن تتبع وعرض المزيد من مراكز البيانات المحددة.`;
		var change4Name_Translated = `واجهة محسّنة`;
		var change4Desc_Translated = `تم تجديد تخطيط محدد المنطقة مع بطاقات خادم أنظف وتنظيم أفضل.`;
		var balanceCheckFailed_Translated = `فشل التحقق من الرصيد. حاول مجدداً.`;
		var purchaseFailed_Translated = `فشل الشراء`;
		var unknownError_Translated = `خطأ غير معروف. تحقق من Roblox وحاول مجدداً.`;
		var newPlanActive_Translated = `⚠ الخطة الجديدة نشطة. قد تحتاج الخطة القديمة إلى إلغاء يدوي في إعدادات Roblox.`;

		var joinTheGameToSubscribe_Translated = `انضم إلى اللعبة للاشتراك`;
		var planActivatesInstantly_Translated = `تُفعَّل خطتك فوراً بعد الشراء داخل اللعبة.`;
		var unlimitedPlanRequired_Translated = `يلزم وجود خطة غير محدودة للانضمام إلى هذا الخادم. اشترك داخل اللعبة لفتح كل منطقة.`;
		var couldNotPreparePurchase_Translated = `تعذّر تحضير الشراء. حاول مرة أخرى.`;
		var launching_Translated = `✓ جارٍ التشغيل… أكمل الشراء داخل اللعبة.`;
		var comeBackAfterSubscribing_Translated = `ارجع إلى هنا بعد الاشتراك لتحديث خطتك.`;
		var stepPressPlay_Translated = `اضغط تشغيل`;
		var stepSubscribeInGame_Translated = `اشترك داخل اللعبة`;
		var stepComeBackRefresh_Translated = `ارجع وحدّث`;
	}

	async function checkRoRegionPermission() {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ action: 'checkRoRegionPermission' }, (res) => {
				resolve(res && res.granted === true);
			});
		});
	}

	async function requestRoRegionPermission() {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ action: 'requestRoRegionPermission' }, (res) => {
				resolve(res && res.granted === true);
			});
		});
	}

	function showRoRegionOnboardPopup(isNewUser, isDark, onGranted) {
		if (document.getElementById('rr-onboard-overlay')) return;

		if (!document.getElementById('rr-onboard-anim-style')) {
			const s = document.createElement('style');
			s.id = 'rr-onboard-anim-style';
			s.textContent = `
				@keyframes rr-ob-in {
					from { opacity: 0; }
					to   { opacity: 1; }
				}
				@keyframes rr-card-in {
					from { opacity: 0; transform: scale(0.96); }
					to   { opacity: 1; transform: scale(1); }
				}
			`;
			document.head.appendChild(s);
		}

		const bg    = isDark ? 'rgb(14,15,18)'   : '#f5f5f5';
		const card  = isDark ? 'rgb(20,21,25)'   : '#ffffff';
		const bdr   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
		const txt   = isDark ? '#e8e8e8'         : '#1a1a1a';
		const muted = isDark ? '#888'            : '#999';
		const sub   = isDark ? '#666'            : '#bbb';
		const rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
		const rowBdr= isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

		const overlay = document.createElement('div');
		overlay.id = 'rr-onboard-overlay';
		overlay.style.cssText = [
			'position:fixed','inset:0','z-index:2147483647',
			'display:flex','align-items:center','justify-content:center',
			`background:rgba(0,0,0,${isDark ? '0.72' : '0.45'})`,
			'animation:rr-ob-in 0.2s ease'
		].join(';');

		const box = document.createElement('div');
		box.style.cssText = [
			`background:${card}`,
			`border:1px solid ${bdr}`,
			'border-radius:16px',
			'box-shadow:0 24px 80px rgba(0,0,0,0.55)',
			'width:92%','max-width:525px',
			'max-height:90vh','overflow-y:auto',
			'animation:rr-card-in 0.22s cubic-bezier(0.4,0,0.2,1)',
			"font-family:'Nunito','Segoe UI',Arial,sans-serif"
		].join(';');

		const header = document.createElement('div');
		header.style.cssText = [
			`background:${bg}`,
			`border-bottom:1px solid ${bdr}`,
			'padding:23px 28px 18px',
			'display:flex','flex-direction:column','gap:4px'
		].join(';');

		const label = document.createElement('div');
		label.style.cssText = `font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:${muted};margin-bottom:2px;`;
		label.textContent = isNewUser ? permissionRoRegionLabel_Translated : permissionWhatsNew_Translated;

		const titleEl = document.createElement('div');
		titleEl.style.cssText = `font-size:23px;font-weight:800;color:${txt};line-height:1.25;letter-spacing:0.01em;`;
		titleEl.textContent = isNewUser ? permissionWelcomeTitle_Translated : permissionUpdateTitle_Translated;

		header.append(label, titleEl);

		const body = document.createElement('div');
		body.style.cssText = `padding:25px 28px;display:flex;flex-direction:column;gap:18px;`;

		const descEl = document.createElement('div');
		descEl.style.cssText = `font-size:16px;line-height:1.65;color:${isDark ? '#aaa' : '#555'};`;
		descEl.textContent = isNewUser ? permissionWelcomeDesc_Translated : permissionUpdateDesc_Translated;
		body.appendChild(descEl);

		if (isNewUser) {
			const features = [
				[feat1Name_Translated, feat1Desc_Translated],
				[feat2Name_Translated, feat2Desc_Translated],
				[feat3Name_Translated, feat3Desc_Translated],
				[feat4Name_Translated, feat4Desc_Translated],
			];
			const featureList = document.createElement('div');
			featureList.style.cssText = `display:flex;flex-direction:column;gap:1px;border-radius:10px;overflow:hidden;border:1px solid ${rowBdr};`;
			features.forEach(([name, detail], i) => {
				const row = document.createElement('div');
				row.style.cssText = [
					`background:${i % 2 === 0 ? rowBg : 'transparent'}`,
					'padding:13px 18px',
					'display:flex','flex-direction:column','gap:2px'
				].join(';');
				const rowName = document.createElement('div');
				rowName.style.cssText = `font-size:15px;font-weight:700;color:${txt};`;
				rowName.textContent = name;
				const rowDetail = document.createElement('div');
				rowDetail.style.cssText = `font-size:14px;color:${muted};line-height:1.45;`;
				rowDetail.textContent = detail;
				row.append(rowName, rowDetail);
				featureList.appendChild(row);
			});
			body.appendChild(featureList);
		} else {
			const changes = [
				[change1Name_Translated, change1Desc_Translated],
				[change2Name_Translated, change2Desc_Translated],
				[change3Name_Translated, change3Desc_Translated],
				[change4Name_Translated, change4Desc_Translated],
			];
			const changeList = document.createElement('div');
			changeList.style.cssText = `display:flex;flex-direction:column;gap:1px;border-radius:10px;overflow:hidden;border:1px solid ${rowBdr};`;
			changes.forEach(([name, detail], i) => {
				const row = document.createElement('div');
				row.style.cssText = [
					`background:${i % 2 === 0 ? rowBg : 'transparent'}`,
					'padding:13px 18px',
					'display:flex','flex-direction:column','gap:2px'
				].join(';');
				const rowName = document.createElement('div');
				rowName.style.cssText = `font-size:15px;font-weight:700;color:${txt};`;
				rowName.textContent = name;
				const rowDetail = document.createElement('div');
				rowDetail.style.cssText = `font-size:14px;color:${muted};line-height:1.45;`;
				rowDetail.textContent = detail;
				row.append(rowName, rowDetail);
				changeList.appendChild(row);
			});
			body.appendChild(changeList);
		}

		const footer = document.createElement('div');
		footer.style.cssText = [
			`background:${bg}`,
			`border-top:1px solid ${bdr}`,
			'padding:18px 28px',
			'display:flex','flex-direction:column','gap:10px'
		].join(';');

		const permNote = document.createElement('div');
		permNote.style.cssText = `font-size:14px;color:${sub};line-height:1.5;text-align:center;`;
		permNote.textContent = permissionNote_Translated;

		const agreeBtn = document.createElement('button');
		agreeBtn.type = 'button';
		agreeBtn.textContent = isNewUser ? permissionAgree_Translated : permissionAgree_Translated;
		agreeBtn.style.cssText = [
			'width:100%','padding:15px 0',
			'background:#335fff','color:#fff',
			'border:none','border-radius:8px',
			'font-size:18px','font-weight:700',
			'cursor:pointer','transition:opacity 0.15s ease',
			'font-family:inherit'
		].join(';');
		agreeBtn.onmouseover = () => { agreeBtn.style.opacity = '0.84'; };
		agreeBtn.onmouseout  = () => { agreeBtn.style.opacity = '1'; };
		agreeBtn.onclick = async () => {
			agreeBtn.disabled = true;
			agreeBtn.style.opacity = '0.5';
			const granted = await requestRoRegionPermission();
			if (granted) {
				overlay.style.opacity = '0';
				overlay.style.transition = 'opacity 0.18s ease';
				setTimeout(() => { overlay.remove(); }, 200);
				onGranted();
			} else {
				agreeBtn.disabled = false;
				agreeBtn.style.opacity = '1';
			}
		};

		footer.append(permNote, agreeBtn);
		box.append(header, body, footer);
		overlay.appendChild(box);
		document.body.appendChild(overlay);
	}

	chrome.storage.local.get({
		regionSelectorEnabled: false,
		showServerListOverlay: true,
		regionSimpleUi: false
	}, async function(settings) {
		if (settings.regionSelectorEnabled && !settings.regionSimpleUi) {

			if (window.location.pathname.includes('/games/')) {
				const url = window.location.href;
				let placeId = null;
				const regex = /https:\/\/www\.roblox\.com\/(?:[a-z]{2}\/)?games\/(\d+)/;
				const match = url.match(regex);
				if (match && match[1]) {
					placeId = match[1]
				}
				let defaultRegions = ["SG", "DE", "FR", "JP", "BR", "NL", "US-CA", "US-VA", "US-IL", "US-TX", "US-FL", "US-NY", "US-WA", "AU", "GB", "IN"];
				const regionCoordinates = {
					"SG": {
						latitude: 1.3521,
						longitude: 103.8198,
						city: "Singapore",
						state: null,
						country: "Singapore"
					},
					"DE": {
						latitude: 50.1109,
						longitude: 8.6821,
						city: "Frankfurt",
						state: null,
						country: "Germany"
					},
					"FR": {
						latitude: 48.8566,
						longitude: 2.3522,
						city: "Paris",
						state: null,
						country: "France"
					},
					"JP": {
						latitude: 35.6895,
						longitude: 139.6917,
						city: "Tokyo",
						state: null,
						country: "Japan"
					},
					"BR": {
						latitude: -14.2350,
						longitude: -51.9253,
						city: "São Paulo",
						state: null,
						country: "Brazil"
					},
					"NL": {
						latitude: 52.3676,
						longitude: 4.9041,
						city: "Amsterdam",
						state: null,
						country: "Netherlands"
					},
					"US-CA": {
						latitude: 34.0522,
						longitude: -118.2437,
						city: "LA",
						state: "California",
						country: "United States"
					},
					"US-VA": {
						latitude: 38.9577,
						longitude: -77.1445,
						city: "Ashburn",
						state: "Virginia",
						country: "United States"
					},
					"US-IL": {
						latitude: 41.8781,
						longitude: -87.6298,
						city: "Chicago",
						state: "Illinois",
						country: "United States"
					},
					"US-TX": {
						latitude: 32.7767,
						longitude: -96.7970,
						city: "Dallas",
						state: "Texas",
						country: "United States"
					},
					"US-FL": {
						latitude: 25.7617,
						longitude: -80.1918,
						city: "Miami",
						state: "Florida",
						country: "United States"
					},
					"US-NY": {
						latitude: 40.7128,
						longitude: -74.0060,
						city: "NYC",
						state: "New York",
						country: "United States"
					},
					"US-WA": {
						latitude: 47.6062,
						longitude: -122.3321,
						city: "Seattle",
						state: "Washington",
						country: "United States"
					},
					"AU": {
						latitude: -33.8688,
						longitude: 151.2093,
						city: "Sydney",
						state: null,
						country: "Australia"
					},
					"GB": {
						latitude: 51.5074,
						longitude: -0.1278,
						city: "London",
						state: null,
						country: "United Kingdom"
					},
					"IN": {
						latitude: 19.0760,
						longitude: 72.8777,
						city: "Mumbai",
						state: null,
						country: "India"
					}
				};
				let regionReplacedMap = {};
				let regionServerCounting = {};
				let allRobloxServers = [];
				let robloxServerPlaces = {};
				let robloxProfileUserLocation = null;
				let checkForRefreshingCount = false;
				let rateLimited = false;
				let nextPageCursor = null;
				let rrServersScanned = 0;
				let rrEggPlayed = false;
				let rrEggFreeze = {};
				let rrRobloxUsername = 'root';
				let rrEggLastCounts = {};
				let rrEggAttempted = {};
				let regionSpecificServers = {};
				let isFetchingServersForRegion = {};
				let regionSelectorShowServerListOverlay = true;
				let regionSelectorEnabled = true;
				let regionButtonAdded = false;
				let serverListState = {
					visibleServerCount: 0,
					fetchedServerIds: new Set(),
					renderedServerIds: new Set(),
					servers: [],
					renderedServersData: new Map(),
					loading: false,
					currentSort: 'ping_lowest'
				};
				let serverIpMap = null;
                let _c = null;
                let _r = null;
                let _ci = null;
				let csrfToken = null;
				let activeRequests = 0;
				let currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'dark';
				let thumbnailCache = new Map();
				let serverEntryCache = new Map();
				let _rrMembershipCache = null;
				let rrFetchSettings = {
					minPlayers: 5,
					maxPlayers: null,
					sortOrder: 'Asc'
				};
				const BATCH_SIZE = 8;
				const THUMBNAIL_BATCH_SIZE = 50;
				// --- BloxRegion speed caps ---
				// Roblox rate-limits the per-server gamejoin lookup, so scanning every page of a
				// popular game takes minutes — but capping it starves region counts. Both caps below
				// default to 0 (unlimited, full counts); set e.g. 800 for faster but partial loads.
				const RR_MAX_SERVERS_SCAN = 0;
				// When a single region is requested, stop paging once this many of its servers are found.
				const RR_REGION_ENOUGH = 0;
				async function detectThemeAPI() {
					currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'dark';
					return currentTheme;
				}
				async function applyTheme() {
					await detectThemeAPI();
				}
				async function updateRegionSelectorState() {
					const settings = await new Promise((resolve) => {
						chrome.storage.local.get({
							regionSelectorEnabled: true,
							showServerListOverlay: true,
						}, (result) => {
							resolve(result);
						});
					});
					regionSelectorEnabled = settings.regionSelectorEnabled;
					regionSelectorShowServerListOverlay = settings.showServerListOverlay;
				}

				(async function rrBootstrapAuthenticatedUser() {
					try {
						const stored = await new Promise(r => chrome.storage.local.get(['authenticatedUserId'], r));
						if (!stored.authenticatedUserId) return;
						const userRes = await fetch('https://users.roblox.com/v1/users/authenticated', { credentials: 'include' });
						if (!userRes.ok) return;
						const userData = await userRes.json();
						const liveUserId = String(userData.id);
						if (stored.authenticatedUserId !== liveUserId) {
							await chrome.storage.local.remove([
								'authenticatedUserId',
								'rr_tool_tier', 'rr_tool_tier_start', 'rr_tool_renewal_canceled',
								'rr_tool_private_server_id', 'rr_tool_universe_id', 'rr_tool_owner_id', 'rr_tool_price',
								'rr_robux_snapshot', 'rr_price_tier', 'rr_robux_snapshot_at'
							]);
							await chrome.storage.local.set({ authenticatedUserId: liveUserId });
						}
					} catch (e) {}

					try {
						const snap = await new Promise(r => chrome.storage.local.get(['rr_robux_snapshot'], r));
						if (snap.rr_robux_snapshot === undefined) {
							chrome.runtime.sendMessage({ action: 'rrEnsureRobuxSnapshot' });
						}
					} catch (e) {}

				try {
					if (liveUserId) {
						const subRes = await chrome.runtime.sendMessage({ action: 'rrGetSubscription', userId: liveUserId });
						if (subRes && subRes.success && subRes.data && subRes.data.data) {
							chrome.storage.local.set({ rr_tool_tier: subRes.data.data.tier || 'free' });
						} else {
							chrome.storage.local.set({ rr_tool_tier: 'free' });
						}
					}
				} catch (e) {}
			})();

			function handleRateLimitedState(limited) {
					rateLimited = limited;
				}
				async function getServerInfo(placeId, robloxCookie, regions, initialCall = true, cursor = null, specificRegion = null) {
					const MAX_RETRIES = 5;
					const INITIAL_BACKOFF_MS = 2000;
					const BACKOFF_FACTOR = 2;
					if (!regionSelectorEnabled) return;
					if (checkForRefreshingCount && initialCall) {
						return;
					}
					let success = false;
					let attempt = 0;
					let currentBackoff = INITIAL_BACKOFF_MS;
					if (initialCall) {
						checkForRefreshingCount = true;
						rateLimited = false;
						handleRateLimitedState(false);
					}
					try {
						if (initialCall) {
							rrServersScanned = 0;
							if (!specificRegion) {
								allRobloxServers = [];
								regionServerCounting = {};
								robloxServerPlaces = {};
								regionSpecificServers = {};
								nextPageCursor = null;
								rrEggPlayed = false;
								rrEggFreeze = {};
								rrEggLastCounts = {};
								rrEggAttempted = {};
							} else {
								regionSpecificServers[specificRegion] = [];
								regionServerCounting[specificRegion] = 0;
							}
						}
						await updateDetailsServers();
						while (attempt <= MAX_RETRIES) {
							attempt++;
							let response = null;
							try {
								const sortOrder = rrFetchSettings.sortOrder || 'Asc';
								let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?excludeFullGames=true&sortOrder=${sortOrder}&limit=100`;
								if (cursor) {
									url += `&cursor=${cursor}`;
								}
								response = await fetch(url, {
									headers: {
										'Accept': 'application/json'
									},
									credentials: 'include'
								});
								if (response.ok) {
									rateLimited = false;
									handleRateLimitedState(false);
									const servers = await response.json();
									const currentPageCursor = servers.nextPageCursor;
									if (!servers.data || servers.data.length === 0) {
										if (initialCall && !specificRegion) {
											allRobloxServers = [];
										}
									} else {
										const minP = rrFetchSettings.minPlayers ?? 0;
										const maxP = rrFetchSettings.maxPlayers ?? null;
										const isDesc = sortOrder === 'Desc';

										const filteredBatch = servers.data.filter(server => {
											const playing = server.playing ?? 0;
											const maxPlayers = server.maxPlayers ?? Infinity;
											if (maxPlayers > 9 && playing < minP) return false;
											if (maxP !== null && playing > maxP) return false;
											if (isDesc && (maxPlayers - playing) < 2) return false;
											return true;
										});

										rrServersScanned += filteredBatch.length;
										const allPagePassedFilter = filteredBatch.length === servers.data.length;
										const noPagePassedFilter = filteredBatch.length === 0;

										if (noPagePassedFilter && currentPageCursor) {
											success = true;
											if (RR_MAX_SERVERS_SCAN > 0 && rrServersScanned >= RR_MAX_SERVERS_SCAN) {
												break;
											}
											await new Promise(resolve => setTimeout(resolve, 100));
											await getServerInfo(placeId, robloxCookie, regions, false, currentPageCursor, specificRegion);
											break;
										}

										const currentBatchServers = filteredBatch;
										currentBatchServers.forEach(server => {
											server._uniqueId = Date.now() + "_" + Math.random().toString(36).substr(2, 9);
										});
										if (initialCall && !specificRegion) {
											allRobloxServers = currentBatchServers;
										} else {
											const existingIds = new Set(allRobloxServers.map(s => s.id));
											const newServers = currentBatchServers.filter(s => !existingIds.has(s.id));
											allRobloxServers = [...allRobloxServers, ...newServers];
										}
										const CONCURRENT_JOIN_LIMIT = 5;
										const JOIN_BATCH_DELAY_MS = 50;
										for (let i = 0; i < currentBatchServers.length; i += CONCURRENT_JOIN_LIMIT) {
											if (rateLimited) {
												await new Promise(resolve => setTimeout(resolve, 4000));
												rateLimited = false;
											}
											const chunk = currentBatchServers.slice(i, i + CONCURRENT_JOIN_LIMIT);
											await Promise.all(chunk.map(async server => {
												await handleServer(server, placeId, robloxCookie, regions, specificRegion).catch(() => null);
											}));
											// Re-render once per batch (not once per server) — the list is a full
											// teardown + re-sort each call, so per-server rebuilds were the main UI cost.
											const liveContainer = document.getElementById('roregion-region-list-container');
											if (liveContainer) await regionServersPopulate(liveContainer);
											if (i + CONCURRENT_JOIN_LIMIT < currentBatchServers.length) {
												await new Promise(resolve => setTimeout(resolve, JOIN_BATCH_DELAY_MS));
											}
										}
									}
									success = true;
									const capReached = RR_MAX_SERVERS_SCAN > 0 && rrServersScanned >= RR_MAX_SERVERS_SCAN;
									const regionSatisfied = RR_REGION_ENOUGH > 0 && specificRegion && (regionServerCounting[specificRegion] || 0) >= RR_REGION_ENOUGH;
									if (currentPageCursor && !capReached && !regionSatisfied) {
										await new Promise(resolve => setTimeout(resolve, 100));
										await getServerInfo(placeId, robloxCookie, regions, false, currentPageCursor, specificRegion);
									}
									break;
								} else if (response.status === 429) {
									rateLimited = true;
									handleRateLimitedState(true);
									if (attempt > MAX_RETRIES) {
										break;
									} else {
										await new Promise(resolve => setTimeout(resolve, currentBackoff));
										currentBackoff *= BACKOFF_FACTOR;
									}
								} else if (response.status === 401 || response.status === 403) {
									success = false;
									break;
								} else {
									const errorDetails = await response.text().catch(() => "Could not read error body");
									success = false;
									break;
								}
							} catch (networkError) {
								success = false;
								break;
							}
						}
						if (specificRegion) {
							updateRegionSpecificCache(specificRegion);
						} else {
							Object.keys(regionServerCounting).forEach(region => {
								updateRegionSpecificCache(region);
							});
						}
					} catch (outerError) {
						success = false;
					} finally {
						if (initialCall || !success) {
							checkForRefreshingCount = false;
							handleRateLimitedState(rateLimited);
							await updateDetailsServers();
						}
					}
				}

				function updateRegionSpecificCache(region) {
					if (!region) return;
					regionSpecificServers[region] = allRobloxServers.filter(server => robloxServerPlaces[server.id]?.c === region);
				}
				(async () => {
					try {
						const response = await fetch('https://raw.githubusercontent.com/RoRegion/Storage/refs/heads/main/regionList.json');
						if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
						serverIpMap = await response.json();
						_c = serverIpMap._c;
						_r = serverIpMap._r;
						_ci = serverIpMap._ci;
					} catch (error) {
						serverIpMap = {};
					}
				})();
				async function getCsrfToken() {
					if (csrfToken) {
						return csrfToken;
					}
					try {
						const response = await fetch('https://auth.roblox.com/v2/logout', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							credentials: 'include'
						});
						const token = response.headers.get('x-csrf-token');
						if (token) {
							csrfToken = token;
							return token;
						} else {
							const metaToken = document.querySelector('meta[name="csrf-token"]');
							if (metaToken) {
								const metaContent = metaToken.getAttribute('content');
								csrfToken = metaContent;
								return csrfToken;
							}
							csrfToken = null;
							return null;
						}
					} catch (error) {
						const metaToken = document.querySelector('meta[name="csrf-token"]');
						if (metaToken) {
							const metaContent = metaToken.getAttribute('content');
							csrfToken = metaContent;
							return csrfToken;
						}
						csrfToken = null;
						return null;
					}
				}
				async function someActionThatNeedsCsrf() {
					const token1 = await getCsrfToken();
					if (!token1) {
						return;
					}
					const token2 = await getCsrfToken();
				}
				someActionThatNeedsCsrf();
				async function handleServer(server, placeId, robloxCookie, targetRegions, specificRegion = null) {
					if (!server || !server.id) {
						return null;
					}
					const serverId = server.id;
					if (robloxServerPlaces[serverId]) {
						const cachedData = robloxServerPlaces[serverId];
						const cachedRegionCode = cachedData.c;
						if (cachedRegionCode) {
							if (cachedRegionCode !== "??") {
								regionServerCounting[cachedRegionCode] = (regionServerCounting[cachedRegionCode] || 0) + 1;
								if (specificRegion && cachedRegionCode === specificRegion) {
									if (!regionSpecificServers[specificRegion]) {
										regionSpecificServers[specificRegion] = [];
									}
									if (!regionSpecificServers[specificRegion].some(s => s.id === serverId)) {
										regionSpecificServers[specificRegion].push(server);
									}
								}
							}
							return cachedRegionCode;
						}
					}
					activeRequests++;
					let regionCode = null;
					let serverLat = null;
					let serverLon = null;
					try {
						if (!csrfToken) {
							await getCsrfToken();
							if (!csrfToken) {
								activeRequests--;
								robloxServerPlaces[serverId] = {
									c: "??",
									l: null
								};
								return null;
							}
						}
						let serverInfoResponse;
						let retry = false;
						let retryCount = 0;
						const MAX_JOIN_RETRIES = 3;
						do {
							retry = false;
							serverInfoResponse = await fetch(`https://gamejoin.roblox.com/v1/join-game-instance`, {
								method: 'POST',
								headers: {
									"Accept": "application/json",
									"Content-Type": "application/json",
									"Referer": `https://www.roblox.com/games/${placeId}/`,
									"Origin": "https://www.roblox.com",
									"X-Csrf-Token": csrfToken,
								},
								body: JSON.stringify({
									placeId: parseInt(placeId, 10),
									isTeleport: false,
									gameId: serverId,
									gameJoinAttemptId: crypto.randomUUID(),
								}),
								credentials: 'include',
							});
							if (serverInfoResponse.status === 403 && serverInfoResponse.headers.get('x-csrf-token') && retryCount < MAX_JOIN_RETRIES) {
								csrfToken = null;
								await getCsrfToken();
								if (!csrfToken) {
									robloxServerPlaces[serverId] = { c: "??", l: null };
									activeRequests--;
									return null;
								}
								retry = true;
								retryCount++;
								await delay(100);
							} else if (serverInfoResponse.status === 429) {
								rateLimited = true;
								if (retryCount < MAX_JOIN_RETRIES) {
									await delay(2000 * (retryCount + 1));
									retry = true;
									retryCount++;
								} else {
									robloxServerPlaces[serverId] = { c: "??", l: null };
									activeRequests--;
									return null;
								}
							} else if (!serverInfoResponse.ok) {
								robloxServerPlaces[serverId] = { c: "??", l: null };
								activeRequests--;
								return null;
							}
						} while (retry);
						const serverInfo = await serverInfoResponse.json();
						try {
							const sessionData = JSON.parse(serverInfo?.joinScript?.SessionId || '{}');
							const latitude = sessionData?.Latitude;
							const longitude = sessionData?.Longitude;
							if (typeof latitude === 'number' && typeof longitude === 'number') {
								if (!robloxProfileUserLocation || robloxProfileUserLocation.latitude !== latitude || robloxProfileUserLocation.longitude !== longitude) {
									robloxProfileUserLocation = {
										latitude: latitude,
										longitude: longitude
									};
								}
							}
						} catch (e) {}
						if (!serverInfo?.joinScript?.UdmuxEndpoints?.[0]?.Address) {
							if (!window.__rrLoggedNoUdmux) {
								window.__rrLoggedNoUdmux = true;
								console.warn('[RoRegion] No UdmuxEndpoints — UA spoof likely failing. joinScript keys:', Object.keys(serverInfo?.joinScript || {}), 'status:', serverInfo?.status);
							}
							robloxServerPlaces[serverId] = {
								c: "??",
								l: null
							};
							activeRequests--;
							return null;
						}
						let ip = serverInfo.joinScript.UdmuxEndpoints[0].Address;
						ip = ip.split('.').slice(0, 3).join('.') + '.0';
						let serverLocationData = null;
                        if (serverIpMap) {
                            const entry = serverIpMap[ip];
                            if (entry) {
                                const country = _c[entry.co] || [];
                                serverLocationData = {
                                    city:      _ci[entry.ci] || null,
                                    country:   { name: country[0] || null, code: country[1] || null },
                                    region:    entry.r != null ? { code: _r[entry.r] } : undefined,
                                    latitude:  entry.la ?? null,
                                    longitude: entry.lo ?? null,
                                };
                            }
                        }
						if (!serverLocationData) {
							const fullIp = serverInfo.joinScript.UdmuxEndpoints[0].Address;
							const subnet = fullIp.split('.').slice(0, 3).join('.') + '.0';
							if (!window.__rrLoggedFallback) {
								window.__rrLoggedFallback = true;
								console.warn('[RoRegion] Fallback IP lookup entering for first time. fullIp=', fullIp, 'subnet=', subnet);
							}
							window.__rrIpCache = window.__rrIpCache || new Map();
							window.__rrIpInflight = window.__rrIpInflight || new Map();
							let geo = window.__rrIpCache.get(subnet);
							if (geo === undefined) {
								let pending = window.__rrIpInflight.get(subnet);
								if (!pending) {
									pending = new Promise(resolve => {
										try {
											chrome.runtime.sendMessage({ action: 'rrLookupIpRegion', ip: fullIp }, (res) => {
												if (chrome.runtime.lastError) { console.warn('[RoRegion] sendMessage lastError', chrome.runtime.lastError); resolve(null); return; }
												if (!window.__rrLoggedFirstResp) { window.__rrLoggedFirstResp = true; console.warn('[RoRegion] First ipwho.is response via background:', res); }
												if (res && res.success && res.data && res.data.country) {
													resolve({
														country: res.data.country,
														region: res.data.region || null,
														latitude: typeof res.data.latitude === 'number' ? res.data.latitude : null,
														longitude: typeof res.data.longitude === 'number' ? res.data.longitude : null
													});
												} else {
													resolve(null);
												}
											});
										} catch (_) { resolve(null); }
									}).then(result => {
										window.__rrIpCache.set(subnet, result);
										window.__rrIpInflight.delete(subnet);
										return result;
									});
									window.__rrIpInflight.set(subnet, pending);
								}
								geo = await pending;
							}
							if (geo) {
								serverLocationData = {
									city: null,
									country: { name: null, code: geo.country },
									region: geo.region ? { code: geo.region } : undefined,
									latitude: geo.latitude,
									longitude: geo.longitude
								};
							}
						}
						if (!serverLocationData) {
							regionCode = "??";
							console.log(`[RoRegion] IP not found in region list JSON: ${ip} (server: ${serverId})`);
						} else {
							const countryCode = serverLocationData?.country?.code;
							let stateCode = null;
							serverLat = serverLocationData?.latitude;
							serverLon = serverLocationData?.longitude;
							if (countryCode === "US" && serverLocationData.region?.code) {
								stateCode = serverLocationData.region.code.replace(/-\d+$/, '');
								regionCode = `US-${stateCode}`;
							} else if (countryCode) {
								regionCode = countryCode;
							} else {
								regionCode = "??";
							}
                            if (regionCode === 'SP') regionCode = 'SG';
						}
						robloxServerPlaces[serverId] = {
							c: regionCode,
							l: (typeof serverLat === 'number' && typeof serverLon === 'number') ? {
								latitude: serverLat,
								longitude: serverLon
							} : null
						};
						if (regionCode && regionCode !== "??") {
							regionServerCounting[regionCode] = (regionServerCounting[regionCode] || 0) + 1;
							if (!regionReplacedMap[regionCode]) {
								regionReplacedMap[regionCode] = server;
							}
						}
						return regionCode;
					} catch (error) {
						robloxServerPlaces[serverId] = {
							c: "??",
							l: null
						};
						return null;
					} finally {
						activeRequests--;
					}
				}


				function calculateDistance(lat1, lon1, lat2, lon2) {
					if (lat1 === null || lon1 === null || lat2 === null || lon2 === null || typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number' || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
						return NaN;
					}
					const R = 6371;
					const toRadians = (degrees) => degrees * Math.PI / 180;
					const lat1Rad = toRadians(lat1);
					const lon1Rad = toRadians(lon1);
					const lat2Rad = toRadians(lat2);
					const lon2Rad = toRadians(lon2);
					const latDiff = lat2Rad - lat1Rad;
					const lonDiff = lon2Rad - lon1Rad;
					const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
					const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
					const distance = R * c;
					return distance;
				}

				async function joinSpecificRegion(region) {
					let bestServer = null;
					const regionServers = allRobloxServers.filter(server => robloxServerPlaces[server.id]?.c === region);
					if (regionServers.length === 0) {
						alert(`No servers currently listed for region ${getFullLocationName(region)}.`);
						return;
					}
					if (robloxProfileUserLocation) {
						let bestRegionScore = -Infinity;
						const regionServerScores = regionServers.map(server => {
							const serverId = server.id;
							if (server.calculatedPing === undefined || isNaN(server.calculatedPing) || server.calculatedPing === Infinity) {
								const serverLoc = robloxServerPlaces[server.id]?.l;
								if (serverLoc && typeof serverLoc.latitude === 'number') {
									const dist = calculateDistance(robloxProfileUserLocation.latitude, robloxProfileUserLocation.longitude, serverLoc.latitude, serverLoc.longitude);
									if (!isNaN(dist)) {
										server.calculatedPing = Math.round(dist * 0.05);
									} else {
										server.calculatedPing = Infinity;
									}
								} else {
									server.calculatedPing = Infinity;
								}
							}
							let ping = server.calculatedPing ?? Infinity;
							let fps = server.fps || 0;
							if (ping === Infinity) {
								return {
									server,
									score: -Infinity
								};
							}
							const normalizedFPS = fps / 60;
							const pingFactor = Math.max(0, 1 - (ping / 1000));
							const clampedFPS = Math.max(0, Math.min(1, normalizedFPS));
							const fpsWeight = 0.4;
							const pingWeight = 0.6;
							const score = (pingWeight * pingFactor) + (fpsWeight * clampedFPS);
							return {
								server,
								score
							};
						});
						const validRegionServers = regionServerScores.filter(result => result && result.score > -Infinity);
						if (validRegionServers.length > 0) {
							validRegionServers.sort((a, b) => b.score - a.score);
							bestServer = validRegionServers[0].server;
							bestRegionScore = validRegionServers[0].score;
						} else {
							regionServers.sort((a, b) => (b.playing ?? 0) - (a.playing ?? 0));
							bestServer = regionServers.length > 0 ? regionServers[0] : null;
							if (bestServer) {}
						}
					} else {
						regionServers.sort((a, b) => (b.playing ?? 0) - (a.playing ?? 0));
						bestServer = regionServers.length > 0 ? regionServers[0] : null;
						if (bestServer) {}
					}
					if (bestServer && bestServer.id) {
						joinSpecificServer(bestServer.id);
					} else {}
				}

				function joinSpecificServer(serverId) {
					const codeToInject = `
                    (function() {
                        if (typeof Roblox !== 'undefined' && Roblox.GameLauncher && Roblox.GameLauncher.joinGameInstance) {
                          Roblox.GameLauncher.joinGameInstance(parseInt('` + placeId + `', 10), String('` + serverId + `'));
                        } else {
                          console.error("Roblox.GameLauncher.joinGameInstance is not available in page context.");
                        }
                      })();
                    `;
					chrome.runtime.sendMessage({
							action: "injectScript",
							codeToInject: codeToInject
						},
						(response) => {
							if (response && response.success) {} else {}
						});
			
				}

					function getFullLocationName(region) {
					const regionData = regionCoordinates[region];
					if (!regionData) {
						if (region === "??") return unknownRegion_Translated;
						if (region.startsWith("US-")) return `${region.split('-')[1]}, USA`;
						return region;
					}
					let parts = [];
					if (regionData.city && regionData.city !== regionData.country) parts.push(regionData.city);
					if (regionData.state && regionData.country === "United States") parts.push(regionData.state);
					if (regionData.country) parts.push(regionData.country);
					parts = [...new Set(parts.filter(p => p))];
					if (parts.length > 2 && parts[parts.length - 1] === "United States") parts[parts.length - 1] = "USA";
					return parts.join(', ') || region;
				}
				function getRegionEmoji(code) {
					return getRegionFlag(code) || '';
				}
				function getRegionFlag(code) {
					const map = {
						'SG': 'sg', 'DE': 'de', 'FR': 'fr', 'JP': 'jp',
						'BR': 'br', 'NL': 'nl', 'AU': 'au', 'GB': 'gb', 'IN': 'in',
						'US-CA': 'us', 'US-VA': 'us', 'US-IL': 'us', 'US-TX': 'us',
						'US-FL': 'us', 'US-NY': 'us', 'US-WA': 'us'
					};
					const countryCode = map[code];
					if (!countryCode) return null;
					return `https://flagcdn.com/20x15/${countryCode}.png`;
				}
				async function fetchThumbnailAssets(tokens) {
					if (!tokens || tokens.length === 0) return {};
					const baseUrl = "https://thumbnails.roblox.com/v1/batch";
					const batchSize = 100;
					const thumbnailMap = {};
					const allRequests = [];
					for (let i = 0; i < tokens.length; i += batchSize) {
						const tokenBatch = tokens.slice(i, i + batchSize);
						if (tokenBatch.length === 0) continue;
						const requests = tokenBatch.map(token => ({
							requestId: `${token}::AvatarHeadshot:48x48:webp:regular`,
							type: "AvatarHeadShot",
							targetId: 0,
							token: token,
							format: "webp",
							size: "48x48"
						}));
						const fetchPromise = fetch(baseUrl, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json'
							},
							body: JSON.stringify(requests),
							credentials: 'omit'
						}).then(response => response.ok ? response.json() : { data: [] })
						.then(data => {
							data.data?.forEach(d => {
								const token = d.requestId?.split('::')[0];
								if (token) {
									thumbnailMap[token] = (d.state === "Completed" && d.imageUrl) ? d.imageUrl : null;
								}
							});
						}).catch(() => { /* silently skip failed thumbnail batches */ });
						allRequests.push(fetchPromise);
						if (i + batchSize < tokens.length) await delay(250);
					}
					await Promise.all(allRequests);
					return thumbnailMap;
				}

				let isScrollingList = false;
				let scrollTimeout = null;
				const SCROLL_DEBOUNCE_MS = 100;

				function addScrollListenerToListContainer(listContainer) {
					if (!listContainer || listContainer.dataset.scrollListenerAttached) {
						return;
					}
					listContainer.addEventListener('scroll', () => {
						isScrollingList = true;
						clearTimeout(scrollTimeout);
						scrollTimeout = setTimeout(() => {
							isScrollingList = false;
						}, SCROLL_DEBOUNCE_MS);
					}, {
						passive: true
					});
					listContainer.dataset.scrollListenerAttached = 'true';
				}
				async function updateDetailsServers(retries = 5) {
					if (regionButtonAdded) {
						const regionListContainer = document.getElementById('roregion-region-list-container');
						if (regionListContainer) {
							await regionServersPopulate(regionListContainer);
						}
						const fetchingFooter = document.getElementById('roregion-fetching-footer');
						if (fetchingFooter) {
							fetchingFooter.style.display = (checkForRefreshingCount && allRobloxServers.length > 0) ? 'flex' : 'none';
						}
						handleRateLimitedState(rateLimited);
						return;
					}

					if (!document.getElementById('roregion-styles')) {
						const styleElement = document.createElement('style');
						styleElement.id = 'roregion-styles';
						styleElement.textContent = `
							@keyframes roregion-spin {
								0%   { transform: rotate(0deg); }
								100% { transform: rotate(360deg); }
							}
							.roregion-fetching-spinner {
								width: 17px; height: 17px; border-radius: 50%;
								border: 2px solid transparent; border-top-color: currentColor;
								animation: roregion-spin 0.75s linear infinite; flex-shrink: 0;
							}
							#roregion-btn-wrapper {
								display: inline-flex;
								align-items: stretch;
								gap: 6px;
								vertical-align: middle;
							}
							#roregion-our-play-btn {
								background-color: #050807 !important;
								border: 1px solid #00ff9c !important;
								cursor: pointer !important;
								display: inline-flex !important;
								align-items: center !important;
								justify-content: center !important;
								color: #00ff9c !important;
								flex-shrink: 0 !important;
								box-shadow: 0 0 12px rgba(0, 255, 156, 0.35) !important;
								transition: filter 0.15s ease, box-shadow 0.15s ease !important;
								font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace !important;
							}
							#roregion-our-play-btn:hover {
								filter: brightness(1.25) !important;
								box-shadow: 0 0 18px rgba(0, 255, 156, 0.55) !important;
							}
							#roregion-our-play-btn:active {
								filter: brightness(0.85) !important;
							}
						`;
						document.head.appendChild(styleElement);
					}

					const injectOurButton = (container) => {
						const robloxBtn = container.querySelector('.btn-common-play-game-lg');
						if (!robloxBtn || document.getElementById('roregion-btn-wrapper') || regionButtonAdded) return;
						regionButtonAdded = true;

						requestAnimationFrame(() => {
							if (document.getElementById('roregion-btn-wrapper')) return;
							if (!robloxBtn.parentNode) {
								regionButtonAdded = false;
								return;
							}

							const fullWidth = robloxBtn.offsetWidth || 300;
							const fullHeight = robloxBtn.offsetHeight || 48;
							const ourSliceWidth = Math.round(fullWidth * 0.30);
							const robloxNewWidth = fullWidth - ourSliceWidth - 6;

							robloxBtn.style.setProperty('width', robloxNewWidth + 'px', 'important');
							robloxBtn.style.setProperty('min-width', '0', 'important');
							robloxBtn.style.setProperty('flex-shrink', '0', 'important');

							const ourPlayBtn = document.createElement('button');
							ourPlayBtn.id = 'roregion-our-play-btn';
							ourPlayBtn.type = 'button';

							const iconSize = Math.round(fullHeight * 0.48);
							ourPlayBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
							const ourPlaySvg = ourPlayBtn.querySelector('svg');
							if (ourPlaySvg) { ourPlaySvg.setAttribute('width', iconSize); ourPlaySvg.setAttribute('height', iconSize); }
							ourPlayBtn.style.cssText = `
								width: ${ourSliceWidth}px;
								height: ${fullHeight}px;
								border-radius: 6px;
							`;

							const wrapper = document.createElement('span');
							wrapper.id = 'roregion-btn-wrapper';
							robloxBtn.parentNode.insertBefore(wrapper, robloxBtn);
							wrapper.appendChild(robloxBtn);
							wrapper.appendChild(ourPlayBtn);

							ourPlayBtn.addEventListener('click', (e) => {
								e.preventDefault();
								e.stopPropagation();
								openRoRegionPopup();
							});
						});
					};

					const ALLOWED_CONTAINER_IDS = new Set(['roregion-btn-wrapper', 'id-verification-container', 'rrp-btn-wrapper']);

					function pruneContainerChildren(container) {
						for (const child of Array.from(container.children)) {
							if (child.id && ALLOWED_CONTAINER_IDS.has(child.id)) continue;
							if (child.classList.contains('btn-common-play-game-lg')) continue;
							child.remove();
						}
					}

					function attachContainerGuard(container) {
						if (container.dataset.rrGuarded) return;
						container.dataset.rrGuarded = '1';
						const guard = new MutationObserver(() => {
							pruneContainerChildren(container);
						});
						guard.observe(container, { childList: true });
					}

					const existingContainer = document.getElementById('game-details-play-button-container');
					if (existingContainer) {
						injectOurButton(existingContainer);
						if (regionButtonAdded) {
							pruneContainerChildren(existingContainer);
							attachContainerGuard(existingContainer);
							return;
						}
					}

					const observer = new MutationObserver(() => {
						const container = document.getElementById('game-details-play-button-container');
						if (!container) return;
						injectOurButton(container);
						if (regionButtonAdded) {
							observer.disconnect();
							pruneContainerChildren(container);
							attachContainerGuard(container);
						}
					});
					observer.observe(document.body, { childList: true, subtree: true });

					setTimeout(() => observer.disconnect(), 15000);
				}

				const TIER_ACCESS = {
					free:      [],
					basic:     [],
					gold:      [],
					unlimited: ['red', 'yellow', 'green']
				};

				function getServerPingTier(server) {
					const ping = server.calculatedPing;
					if (ping === undefined || isNaN(ping) || ping === Infinity) return 'red';
					if (ping < 80)  return 'green';
					if (ping < 150) return 'yellow';
					return 'red';
				}

				async function openRoRegionPopup() {
					if (document.getElementById('roregion-unified-overlay')) return;
					const isDarkMode = currentTheme === 'dark';
					const body = document.body;
					const originalOverflow = body.style.overflow;

					const overlay = document.createElement('div');
					overlay.id = 'roregion-unified-overlay';
					overlay.style.cssText = `
						position: fixed; top: 0; left: 0; width: 100%; height: 100%;
						display: flex; justify-content: center; align-items: center;
						z-index: 10010; background-color: rgba(0,0,0,0.65);
						opacity: 0; transition: opacity 0.2s ease;
					`;
					body.style.overflow = 'hidden';

					const modal = document.createElement('div');
					modal.style.cssText = `
						display: flex; flex-direction: row;
						width: 92%; max-width: 1100px; height: 78vh; max-height: 780px;
						background-color: #050807;
						border-radius: 6px;
						box-shadow: 0 0 80px rgba(0, 255, 156, 0.18), 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px #1a2a1f;
						overflow: hidden;
						transform: scale(0.96);
						transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
						font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						color: #c8d4c8;
					`;

					const leftPanel = document.createElement('div');
					leftPanel.style.cssText = `
						width: 38%; min-width: 320px; max-width: 440px;
						display: flex; flex-direction: column;
						background-color: #0a0f0c;
						border-right: 1px solid #1a2a1f;
						overflow: visible;
					`;

					const leftHeader = document.createElement('div');
					leftHeader.className = 'roregion-panel-header';
					leftHeader.style.cssText = `
						border-bottom: 1px solid #1a2a1f;
						height: 63px; box-sizing: border-box;
						background: linear-gradient(180deg, #0d1411 0%, #0a0f0c 100%);
					`;
					const leftTitle = document.createElement('span');
					leftTitle.innerHTML = `<span style="color:#c8d4c8">// </span><span style="color:#00ff9c">Server Region</span>`;
					leftTitle.style.cssText = `font-size: 14px; font-weight: 700; letter-spacing: 0.04em; text-transform: lowercase;`;

					leftHeader.append(leftTitle);

					const regionListContainer = document.createElement('div');
					regionListContainer.id = 'roregion-region-list-container';
					regionListContainer.style.cssText = `
						flex: 1; overflow-y: auto; overflow-x: hidden; padding: 4px 0;
						scrollbar-width: thin;
						scrollbar-color: rgba(128,128,128,0.35) transparent;
					`;
					const scrollStyle = document.createElement('style');
					scrollStyle.textContent = `
						#roregion-region-list-container::-webkit-scrollbar { width: 5px; }
						#roregion-region-list-container::-webkit-scrollbar-track { background: transparent; }
						#roregion-region-list-container::-webkit-scrollbar-thumb {
							background-color: rgba(128,128,128,0.35);
							border-radius: 10px;
						}
						#roregion-region-list-container::-webkit-scrollbar-thumb:hover {
							background-color: rgba(128,128,128,0.55);
						}
						#roregion-server-list-content-area::-webkit-scrollbar { width: 5px; }
						#roregion-server-list-content-area::-webkit-scrollbar-track { background: transparent; }
						#roregion-server-list-content-area::-webkit-scrollbar-thumb {
							background-color: rgba(128,128,128,0.35);
							border-radius: 10px;
						}
						#roregion-server-list-content-area::-webkit-scrollbar-thumb:hover {
							background-color: rgba(128,128,128,0.55);
						}
						.roregion-panel-header {
							display: flex; align-items: center; justify-content: space-between;
							flex-shrink: 0; box-sizing: border-box; padding: 18px 16px 12px 16px;
						}
					`;
					document.head.appendChild(scrollStyle);
					addScrollListenerToListContainer(regionListContainer);
					await regionServersPopulate(regionListContainer);

					const fetchingFooter = document.createElement('div');
					fetchingFooter.id = 'roregion-fetching-footer';
					fetchingFooter.style.cssText = `
						display: flex; align-items: center; justify-content: flex-start; gap: 10px;
						padding: 10px 16px;
						border-top: 1px solid #1a2a1f;
						color: #5a6a5a; font-size: 12px; flex-shrink: 0;
						font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
					`;
					const footerSpinner = document.createElement('span');
					footerSpinner.className = 'roregion-fetching-spinner';
					footerSpinner.style.color = '#00ff9c';
					const footerText = document.createElement('span');
					footerText.textContent = '> ' + (fetchingMoreServers_Translated || 'fetching...');
					fetchingFooter.append(footerSpinner, footerText);

					leftPanel.append(leftHeader, regionListContainer, fetchingFooter);

					const rightPanel = document.createElement('div');
					rightPanel.id = 'roregion-right-panel';
					rightPanel.style.cssText = `
						flex: 1; display: flex; flex-direction: column; overflow: hidden;
						background-color: #050807;
					`;

					const rightHeader = document.createElement('div');
					rightHeader.className = 'roregion-panel-header';
					rightHeader.style.cssText = `
						background: linear-gradient(180deg, #11181a 0%, #0a0f0c 100%);
						border-bottom: 1px solid #1a2a1f;
						gap: 12px; padding: 14px 18px;
						height: 63px; box-sizing: border-box;
					`;
					const rightTitleEl = document.createElement('div');
					rightTitleEl.id = 'roregion-right-title';
					rightTitleEl.style.cssText = `font-size: 13px; font-weight: 700; color: #c8d4c8; display: flex; align-items: center; gap: 10px; flex: 1; letter-spacing: 0.05em;`;
					const trafficDots = document.createElement('span');
					trafficDots.style.cssText = `display: inline-flex; gap: 6px; margin-right: 4px;`;
					trafficDots.innerHTML = `
						<span style="width:11px;height:11px;border-radius:50%;background:#ff5f57;display:inline-block;"></span>
						<span style="width:11px;height:11px;border-radius:50%;background:#febc2e;display:inline-block;"></span>
						<span style="width:11px;height:11px;border-radius:50%;background:#28c840;display:inline-block;"></span>
					`;
					const titleText = document.createElement('span');
					titleText.id = 'roregion-right-title-text';
					titleText.innerHTML = `<span style="color:#5a6a5a">root@</span><span style="color:#00ff9c">bloxregion</span><span style="color:#5a6a5a">:~</span>`;
					rightTitleEl.append(trafficDots, titleText);

					const closeBtn = document.createElement('button');
					closeBtn.textContent = '[ exit ]';
					closeBtn.style.cssText = `
						padding: 6px 14px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: 700;
						background-color: transparent;
						border: 1px solid #2d6a4d;
						color: #00ff9c; transition: all 0.15s ease; flex-shrink: 0;
						font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						letter-spacing: 0.04em;
					`;
					closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(0,255,156,0.1)'; closeBtn.style.borderColor = '#00ff9c'; };
					closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.borderColor = '#2d6a4d'; };
					const closePopup = () => {
						overlay.style.opacity = '0';
						modal.style.transform = 'scale(0.95)';
						setTimeout(() => {
							overlay.remove();
							body.style.overflow = originalOverflow;
						}, 200);
					};
					closeBtn.onclick = closePopup;

					const homeBtn = document.createElement('button');
					homeBtn.textContent = '[ home ]';
					homeBtn.style.cssText = `
						padding: 6px 14px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: 700;
						background-color: transparent;
						border: 1px solid #2d6a4d;
						color: #00ff9c; transition: all 0.15s ease; flex-shrink: 0;
						font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						letter-spacing: 0.04em; margin-right: 4px;
					`;
					homeBtn.onmouseover = () => { homeBtn.style.background = 'rgba(0,255,156,0.1)'; homeBtn.style.borderColor = '#00ff9c'; };
					homeBtn.onmouseout = () => { homeBtn.style.background = 'transparent'; homeBtn.style.borderColor = '#2d6a4d'; };
					homeBtn.onclick = () => { if (rightBody._showDefault) rightBody._showDefault(); };

					rightHeader.append(rightTitleEl, homeBtn, closeBtn);

					const rightBody = document.createElement('div');
					rightBody.id = 'roregion-right-body';
					rightBody.style.cssText = `flex: 1; overflow-y: auto; display: flex; flex-direction: column;`;

					function resolveCommand(raw) {
						if (!raw) return null;
						const t = String(raw).trim().toLowerCase();
						if (!t) return null;
						if (t === 'help' || t === '?') return { kind: 'help' };
						if (t === 'home' || t === 'clear' || t === 'cls') return { kind: 'home' };
						if (t === 'list' || t === 'ls') return { kind: 'list' };
						if (t === 'refresh' || t === 'reload') return { kind: 'refresh' };
						if (t === 'credits') return { kind: 'credits' };
						if (t === 'contacts' || t === 'contact') return { kind: 'contacts' };
						if (t === 'exit' || t === 'quit') return { kind: 'exit' };
						if (t === 'version' || t === 'ver' || t === '-v' || t === '--version') return { kind: 'version' };
						const continents = {
							'asia': 'Asia', 'europe': 'Europe', 'north america': 'North America',
							'south america': 'South America', 'oceania': 'Oceania', 'africa': 'Africa',
							'na': 'North America', 'sa': 'South America', 'eu': 'Europe', 'oc': 'Oceania'
						};
						if (continents[t]) return { kind: 'continent', value: continents[t] };
						const foundCodes = Object.keys(regionServerCounting).filter(c => c !== '??');
						const allCodes = new Set([...defaultRegions, ...foundCodes]);
						for (const code of allCodes) {
							if (code.toLowerCase() === t) return { kind: 'region', value: code };
						}
						for (const code of allCodes) {
							const info = regionCoordinates[code];
							if (!info) continue;
							const candidates = [info.country, info.city, info.state, getFullLocationName(code)]
								.filter(Boolean)
								.map(s => String(s).toLowerCase());
							if (candidates.includes(t)) return { kind: 'region', value: code };
						}
						for (const code of allCodes) {
							const info = regionCoordinates[code];
							if (!info) continue;
							const haystack = [info.country, info.city, info.state]
								.filter(Boolean)
								.map(s => String(s).toLowerCase())
								.join('|');
							if (haystack.includes(t)) return { kind: 'region', value: code };
						}
						return { kind: 'unknown', raw };
					}

					function showContinentServers(continentName) {
						const titleText = document.getElementById('roregion-right-title-text');
						if (titleText) {
							titleText.textContent = '';
							const rrTtSegs = [['#5a6a5a', 'root@'], ['#00ff9c', 'bloxregion'], ['#5a6a5a', ':~/'], ['#4a7bf7', continentName.toLowerCase().replace(/\s+/g, '_')]];
							for (const rrSeg of rrTtSegs) { const sp = document.createElement('span'); sp.style.color = rrSeg[0]; sp.textContent = rrSeg[1]; titleText.appendChild(sp); }
						}
						const matchingCodes = Array.from(new Set([...defaultRegions, ...Object.keys(regionServerCounting)]))
							.filter(c => c !== '??' && getRegionContinentInfo(c, regionCoordinates) === continentName);
						const aggregateServers = [];
						for (const code of matchingCodes) {
							const list = regionSpecificServers[code] || allRobloxServers.filter(s => robloxServerPlaces[s.id]?.c === code);
							for (const s of list) if (!aggregateServers.some(x => x.id === s.id)) aggregateServers.push(s);
						}
						rightBody.innerHTML = '';
						rightBody.appendChild(buildFilterBar());
						const area = document.createElement('div');
						area.id = 'roregion-server-list-content-area';
						area.style.cssText = `flex: 1; overflow-y: auto; padding: 16px 20px; scrollbar-width: thin; scrollbar-color: rgba(0,255,156,0.25) transparent;`;
						const grid = document.createElement('div');
						grid.id = 'roregion-actual-server-list';
						grid.style.cssText = `display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 10px;`;
						area.appendChild(grid);
						rightBody.appendChild(area);
						if (aggregateServers.length === 0) {
							const rrNoSrv = document.createElement('p');
							rrNoSrv.style.cssText = "grid-column:1/-1;text-align:center;padding:40px 0;color:#5a6a5a;font-family:'JetBrains Mono',monospace";
							rrNoSrv.textContent = '// no servers indexed in ' + continentName;
							grid.appendChild(rrNoSrv);
							return;
						}
						serverListState = {
							...serverListState,
							visibleServerCount: 0,
							fetchedServerIds: new Set(),
							renderedServerIds: new Set(),
							servers: aggregateServers,
							loading: false,
							renderedServersData: new Map(),
							currentRegion: '__continent__'
						};
						sortRobloxServers().then(() => {
							serverListState.viewportHeight = window.innerHeight * 0.7;
							renderServerRegions();
						});
					}

					async function showDefaultRightPanel() {
						const titleText = document.getElementById('roregion-right-title-text');
						if (titleText) titleText.innerHTML = `<span style="color:#5a6a5a">root@</span><span style="color:#00ff9c">bloxregion</span><span style="color:#5a6a5a">:~</span>`;
						rightBody.innerHTML = '';

						if (!document.getElementById('bloxregion-term-style')) {
							const ts = document.createElement('style');
							ts.id = 'bloxregion-term-style';
							ts.textContent = `
								@keyframes bloxregion-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
								.bloxregion-cursor { display: inline-block; width: 8px; height: 14px; background: #00ff9c; vertical-align: -2px; margin-left: 3px; animation: bloxregion-blink 1s steps(1) infinite; }
								@keyframes bloxregion-line-in { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
								.bloxregion-line { animation: bloxregion-line-in 0.2s ease-out both; }
								.bloxregion-input { background: transparent; border: none; outline: none; color: #00ff9c; font-family: 'JetBrains Mono','Fira Code','Courier New',monospace; font-size: 13px; flex: 1; caret-color: #00ff9c; }
								.bloxregion-input::placeholder { color: #3a4a3a; }
								.bloxregion-chip { display: inline-block; padding: 1px 8px; border: 1px solid #2d6a4d; border-radius: 3px; color: #00ff9c; margin: 2px 4px 2px 0; font-size: 11px; cursor: pointer; transition: all 0.15s; }
								.bloxregion-chip:hover { background: rgba(0,255,156,0.15); border-color: #00ff9c; }
							`;
							document.head.appendChild(ts);
						}

						const container = document.createElement('div');
						container.style.cssText = `
							flex: 1; display: flex; flex-direction: column;
							background-color: #050807;
							font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						`;

						const term = document.createElement('div');
						term.id = 'bloxregion-term';
						term.style.cssText = `
							flex: 1; padding: 22px 24px; overflow-y: auto;
							font-size: 13px; line-height: 1.75; color: #c8d4c8;
							scrollbar-width: thin; scrollbar-color: rgba(0,255,156,0.25) transparent;
						`;

						const total = allRobloxServers.length;
						const regionsCount = Object.keys(regionServerCounting || {}).filter(k => k !== '??').length;
						let rrCoreVer = '?';
						try { rrCoreVer = chrome.runtime.getManifest().version; } catch (e) {}
						const bootLines = [
							{ p: '>>', text: 'Initializing BloxRegion Core v' + rrCoreVer + '...' },
							{ p: '>>', text: 'Loading region mapping modules... [OK]' },
							{ p: '>>', text: 'Spoofing client headers via dNR... [OK]' },
							{ p: '>>', text: 'Resolving datacenter geolocation... [OK]' },
							{ p: '>>', text: `Indexed ${total} servers across ${regionsCount} regions.`, statsLine: true },
							{ p: '>>', text: 'Type a region or continent to view its servers.', bold: true },
						];

						bootLines.forEach((l, idx) => {
							const row = document.createElement('div');
							row.className = 'bloxregion-line';
							row.style.cssText = `display: flex; gap: 10px; animation-delay: ${idx * 70}ms;`;
							const prefix = document.createElement('span');
							prefix.style.cssText = `color: #00ff9c; flex-shrink: 0;`;
							prefix.textContent = l.p;
							const text = document.createElement('span');
							text.style.cssText = `${l.bold ? 'font-weight: 700;' : ''}`;
							if (l.statsLine) text.id = 'bloxregion-indexed-stats';
							const rrOkParts = String(l.text).split('[OK]');
							rrOkParts.forEach((rrPart, rrIdx) => {
								if (rrIdx > 0) { const ok = document.createElement('span'); ok.style.cssText = 'color:#00ff9c;font-weight:700'; ok.textContent = '[OK]'; text.appendChild(ok); }
								if (rrPart) text.appendChild(document.createTextNode(rrPart));
							});
							row.append(prefix, text);
							term.appendChild(row);
						});

						const optsRow = document.createElement('div');
						optsRow.className = 'bloxregion-line';
						optsRow.style.cssText = `display: flex; flex-wrap: wrap; gap: 4px; align-items: center; animation-delay: ${bootLines.length * 70}ms; padding-top: 4px;`;
						const optsPrefix = document.createElement('span');
						optsPrefix.style.cssText = `color: #00ff9c; flex-shrink: 0; margin-right: 6px;`;
						optsPrefix.textContent = '>>';
						const optsLabel = document.createElement('span');
						optsLabel.style.cssText = `color:#5a6a5a; margin-right: 4px;`;
						optsLabel.textContent = 'available:';
						optsRow.append(optsPrefix, optsLabel);
						const foundCodes = Object.keys(regionServerCounting).filter(c => c !== '??' && (regionServerCounting[c] || 0) > 0);
						const optList = foundCodes.length > 0 ? foundCodes : defaultRegions.slice(0, 8);
						const continentSet = new Set();
						optList.forEach(code => {
							const name = getFullLocationName(code) || code;
							const chip = document.createElement('span');
							chip.className = 'bloxregion-chip';
							chip.textContent = name.split(',')[0];
							chip.onclick = () => runCommand(code);
							optsRow.appendChild(chip);
							const cont = getRegionContinentInfo(code, regionCoordinates);
							if (cont && cont !== 'Unknown' && cont !== unknown_Translated) continentSet.add(cont);
						});
						if (continentSet.size > 0) {
							const sep = document.createElement('span');
							sep.style.cssText = `color:#3a4a3a; margin: 0 4px;`;
							sep.textContent = '//';
							optsRow.appendChild(sep);
							[...continentSet].forEach(c => {
								const chip = document.createElement('span');
								chip.className = 'bloxregion-chip';
								chip.style.borderColor = '#4a7bf7';
								chip.style.color = '#4a7bf7';
								chip.textContent = c;
								chip.onclick = () => runCommand(c);
								optsRow.appendChild(chip);
							});
						}
						term.appendChild(optsRow);

						const spacer = document.createElement('div');
						spacer.style.cssText = 'height: 14px;';
						term.appendChild(spacer);

						const historyBox = document.createElement('div');
						historyBox.id = 'bloxregion-history';
						historyBox.style.cssText = `display: flex; flex-direction: column; gap: 0;`;
						term.appendChild(historyBox);

						const promptRow = document.createElement('div');
						promptRow.style.cssText = `display: flex; gap: 8px; align-items: center; padding-top: 4px;`;
						const promptLabel = document.createElement('span');
						promptLabel.innerHTML = `<span style="color:#00ff9c;font-weight:700"><span class="bloxregion-user">root</span>@bloxregion</span><span style="color:#5a6a5a">:</span><span style="color:#4a7bf7">~</span><span style="color:#5a6a5a">$</span>`;
						const rrPromptUser = promptLabel.querySelector('.bloxregion-user');
						if (rrPromptUser) rrPromptUser.textContent = rrRobloxUsername;
						rrEnsureRobloxUsername();
						promptLabel.style.flexShrink = '0';
						const input = document.createElement('input');
						input.type = 'text';
						input.className = 'bloxregion-input';
						input.placeholder = 'e.g. singapore, brazil, asia, europe — try `help`';
						input.spellcheck = false;
						input.autocomplete = 'off';
						promptRow.append(promptLabel, input);
						term.appendChild(promptRow);

						setTimeout(() => input.focus(), bootLines.length * 70 + 80);

						// Command output types out like a real terminal (250 wpm = 5-char words = 48ms/char);
						// the command echo renders instantly — only output animates. Long outputs are
						// compressed to fit RR_TYPE_MAX_MS so `list` stays usable.
						const RR_TYPE_WPM = 250;
						const RR_TYPE_MAX_MS = 4000;
						let rrTypeQueue = Promise.resolve();
						function appendHistory(html, instant) {
							const row = document.createElement('div');
							row.style.cssText = `display: flex; gap: 8px; align-items: flex-start;`;
							const rrDoc = new DOMParser().parseFromString(html, 'text/html');
							while (rrDoc.body.firstChild) row.appendChild(rrDoc.body.firstChild);
							historyBox.appendChild(row);
							if (instant) { term.scrollTop = term.scrollHeight; return; }
							const rrTexts = [];
							(function rrCollect(node) {
								for (const child of Array.from(node.childNodes)) {
									if (child.nodeType === 3) rrTexts.push([child, child.nodeValue]);
									else rrCollect(child);
								}
							})(row);
							const totalChars = rrTexts.reduce((n, t) => n + t[1].length, 0);
							if (totalChars === 0) { term.scrollTop = term.scrollHeight; return; }
							for (const t of rrTexts) t[0].nodeValue = '';
							let rrDelay = Math.round(60000 / (RR_TYPE_WPM * 5));
							if (rrDelay * totalChars > RR_TYPE_MAX_MS) rrDelay = Math.max(4, Math.floor(RR_TYPE_MAX_MS / totalChars));
							rrTypeQueue = rrTypeQueue.then(() => new Promise(resolve => {
								let ti = 0, ci = 0;
								const timer = setInterval(() => {
									if (ti >= rrTexts.length) { clearInterval(timer); resolve(); return; }
									const rrPair = rrTexts[ti];
									rrPair[0].nodeValue = rrPair[1].slice(0, ++ci);
									if (ci >= rrPair[1].length) { ti++; ci = 0; }
									term.scrollTop = term.scrollHeight;
								}, rrDelay);
							}));
						}

						function runCommand(rawInput) {
							const safe = String(rawInput).replace(/[<>&]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[ch]));
							appendHistory(`<span style="color:#00ff9c;font-weight:700;flex-shrink:0"><span class="bloxregion-user">${rrRobloxUsername}</span>@bloxregion</span><span style="color:#5a6a5a">:</span><span style="color:#4a7bf7">~</span><span style="color:#5a6a5a">$</span><span style="color:#c8d4c8">${safe}</span>`, true);
							const cmd = resolveCommand(rawInput);
							if (!cmd) return;
							if (cmd.kind === 'help') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">commands: <span style="color:#00ff9c">help</span>, <span style="color:#00ff9c">list</span>, <span style="color:#00ff9c">home</span>, <span style="color:#00ff9c">refresh</span>, <span style="color:#00ff9c">credits</span>, <span style="color:#00ff9c">contacts</span>, <span style="color:#00ff9c">version</span>, <span style="color:#00ff9c">exit</span>, &lt;country&gt; (singapore, brazil, ...), &lt;continent&gt; (asia, europe, north america, oceania, south america)</span>`);
								return;
							}
							if (cmd.kind === 'credits') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">credits:</span>`);
								appendHistory(`<span style="color:#00ff9c">&nbsp;&nbsp;-</span><span style="color:#c8d4c8"><span style="color:#5a6a5a">UI Designer:</span> <span style="color:#c8d4c8">Kanezama</span></span>`);
								appendHistory(`<span style="color:#00ff9c">&nbsp;&nbsp;-</span><span style="color:#c8d4c8"><span style="color:#5a6a5a">Main Coder:</span> <a href="https://github.com/AlfatihRabbani" target="_blank" rel="noopener" style="color:#00ff9c;text-decoration:underline;cursor:pointer">AlfatihRabbani</a></span>`);
								return;
							}
							if (cmd.kind === 'contacts') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">contacts — AlfatihRabbani:</span>`);
								appendHistory(`<span style="color:#00ff9c">&nbsp;&nbsp;-</span><span style="color:#c8d4c8"><span style="color:#5a6a5a">github:&nbsp;&nbsp;</span><a href="https://github.com/AlfatihRabbani" target="_blank" rel="noopener" style="color:#00ff9c;text-decoration:underline;cursor:pointer">https://github.com/AlfatihRabbani</a></span>`);
								appendHistory(`<span style="color:#00ff9c">&nbsp;&nbsp;-</span><span style="color:#c8d4c8"><span style="color:#5a6a5a">linkedin:</span> <a href="https://www.linkedin.com/in/fatih-rabbani-50a39037b/" target="_blank" rel="noopener" style="color:#4a7bf7;text-decoration:underline;cursor:pointer">https://www.linkedin.com/in/fatih-rabbani-50a39037b/</a></span>`);
								return;
							}
							if (cmd.kind === 'version') {
								let rrVer = 'unknown';
								try { rrVer = chrome.runtime.getManifest().version; } catch (e) {}
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">BloxRegion <span style="color:#00ff9c">v${rrVer}</span> — free and open source</span>`);
								return;
							}
							if (cmd.kind === 'exit') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">closing session...</span>`);
								setTimeout(() => closePopup(), 120);
								return;
							}
							if (cmd.kind === 'list') {
								const codes = Array.from(new Set([...defaultRegions, ...Object.keys(regionServerCounting)])).filter(c => c !== '??');
								const namesHtml = codes.map(c => `<span style="color:#00ff9c">${getFullLocationName(c) || c}</span> <span style="color:#5a6a5a">[${c}: ${regionServerCounting[c]||0}]</span>`).join('<br>');
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">${namesHtml}</span>`);
								return;
							}
							if (cmd.kind === 'home' || cmd.kind === 'refresh') {
								if (cmd.kind === 'refresh' && typeof placeId !== 'undefined' && placeId) {
									try { getServerInfo(placeId, null, defaultRegions, true); } catch (_) {}
								}
								if (rightBody._showDefault) rightBody._showDefault();
								return;
							}
							if (cmd.kind === 'region') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">opening region <span style="color:#00ff9c">${cmd.value}</span>...</span>`);
								setTimeout(() => showRegionServers(cmd.value), 80);
								return;
							}
							if (cmd.kind === 'continent') {
								appendHistory(`<span style="color:#00ff9c">&gt;&gt;</span><span style="color:#c8d4c8">aggregating servers in <span style="color:#4a7bf7">${cmd.value}</span>...</span>`);
								setTimeout(() => showContinentServers(cmd.value), 80);
								return;
							}
							appendHistory(`<span style="color:#ff5f57">!!</span><span style="color:#c8d4c8">unknown command: <span style="color:#ff5f57">${safe}</span> — try <span style="color:#00ff9c">help</span></span>`);
						}

						input.addEventListener('keydown', (e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								const v = input.value;
								input.value = '';
								if (v.trim()) runCommand(v);
							}
						});

						container.appendChild(term);

						const footer = document.createElement('div');
						footer.style.cssText = `
							padding: 10px 16px; display: flex; align-items: center; gap: 12px;
							border-top: 1px solid #1a2a1f;
							background: #0a0f0c;
							font-size: 12px; color: #5a6a5a;
						`;
						const footerLabel = document.createElement('span');
						footerLabel.style.cssText = `flex: 1;`;
						footerLabel.innerHTML = `<span style="color:#2d6a4d">[*]</span> session cache — wiped on close`;
						const refreshBtn = document.createElement('button');
						refreshBtn.type = 'button';
						refreshBtn.textContent = '$ refresh';
						refreshBtn.style.cssText = `
							padding: 5px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: 700;
							background: transparent; color: #00ff9c; border: 1px solid #2d6a4d;
							font-family: inherit; letter-spacing: 0.04em;
							transition: all 0.15s ease;
						`;
						refreshBtn.onmouseover = () => { refreshBtn.style.background = 'rgba(0,255,156,0.1)'; refreshBtn.style.borderColor = '#00ff9c'; };
						refreshBtn.onmouseout  = () => { refreshBtn.style.background = 'transparent'; refreshBtn.style.borderColor = '#2d6a4d'; };
						refreshBtn.onclick = () => {
							if (typeof placeId !== 'undefined' && placeId) {
								try { getServerInfo(placeId, null, defaultRegions, true); } catch (_) {}
							}
						};
						footer.append(footerLabel, refreshBtn);
						container.appendChild(footer);

						rightBody.appendChild(container);
					}

					function buildFilterBar() {
						const bar = document.createElement('div');
						bar.id = 'bloxregion-filter-bar';
						bar.style.cssText = `
							display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 16px;
							border-bottom: 1px solid #1a2a1f;
							background: #0a0f0c;
							font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						`;
						const label = document.createElement('span');
						label.innerHTML = `<span style="color:#5a6a5a">sort:</span>`;
						label.style.cssText = `font-size: 12px; align-self: center; margin-right: 4px;`;
						bar.appendChild(label);
						const opts = [
							{ key: 'players_lowest',  text: 'players (lowest)' },
							{ key: 'players_highest', text: 'players (highest)' },
							{ key: 'ping_lowest',     text: 'ping (lowest)' },
							{ key: 'ping_highest',    text: 'ping (highest)' }
						];
						const current = serverListState.currentSort;
						opts.forEach(o => {
							const btn = document.createElement('button');
							btn.type = 'button';
							btn.dataset.sortKey = o.key;
							btn.textContent = o.text;
							const active = current === o.key;
							btn.style.cssText = `
								padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 700;
								background: ${active ? 'rgba(0,255,156,0.15)' : 'transparent'};
								border: 1px solid ${active ? '#00ff9c' : '#2d6a4d'};
								color: ${active ? '#00ff9c' : '#c8d4c8'};
								font-family: inherit; letter-spacing: 0.04em;
								transition: all 0.15s ease;
							`;
							btn.onmouseover = () => { if (serverListState.currentSort !== o.key) { btn.style.background = 'rgba(0,255,156,0.08)'; btn.style.borderColor = '#00ff9c'; } };
							btn.onmouseout  = () => { if (serverListState.currentSort !== o.key) { btn.style.background = 'transparent'; btn.style.borderColor = '#2d6a4d'; } };
							btn.onclick = async () => {
								serverListState.currentSort = o.key;
								bar.querySelectorAll('button[data-sort-key]').forEach(b => {
									const isActive = b.dataset.sortKey === o.key;
									b.style.background = isActive ? 'rgba(0,255,156,0.15)' : 'transparent';
									b.style.borderColor = isActive ? '#00ff9c' : '#2d6a4d';
									b.style.color = isActive ? '#00ff9c' : '#c8d4c8';
								});
								serverListState.visibleServerCount = 0;
								serverListState.renderedServerIds = new Set();
								serverListState.renderedServersData = new Map();
								const list = document.getElementById('roregion-actual-server-list');
								if (list) list.innerHTML = '';
								await sortRobloxServers();
								renderServerRegions();
							};
							bar.appendChild(btn);
						});
						return bar;
					}

					function showRegionServers(regionCode) {
						const titleText = document.getElementById('roregion-right-title-text');
						if (titleText) {
							titleText.innerHTML = '';
							const flagUrl = getRegionFlag(regionCode);
							if (flagUrl) {
								const img = document.createElement('img');
								img.src = flagUrl;
								img.style.cssText = 'width:20px;height:14px;object-fit:cover;border-radius:2px;flex-shrink:0;margin-right:8px;vertical-align:-2px;';
								titleText.appendChild(img);
							}
							const userPart = document.createElement('span');
							const rrUpSegs = [['#5a6a5a', 'root@'], ['#00ff9c', 'bloxregion'], ['#5a6a5a', ':~/'], ['#4a7bf7', (regionCode || '').toLowerCase()]];
							for (const rrSeg of rrUpSegs) { const sp = document.createElement('span'); sp.style.color = rrSeg[0]; sp.textContent = rrSeg[1]; userPart.appendChild(sp); }
							titleText.appendChild(userPart);
						}
						rightBody.innerHTML = '';
						rightBody.appendChild(buildFilterBar());
						const serverListArea = document.createElement('div');
						serverListArea.id = 'roregion-server-list-content-area';
						serverListArea.style.cssText = `flex: 1; overflow-y: auto; padding: 16px 20px; scrollbar-width: thin; scrollbar-color: rgba(0,255,156,0.25) transparent;`;
						const serverList = document.createElement('div');
						serverList.id = 'roregion-actual-server-list';
						serverList.style.cssText = `display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 10px;`;
						serverList.innerHTML = '';
						serverListArea.appendChild(serverList);
						rightBody.appendChild(serverListArea);

						let serversInRegion = regionSpecificServers[regionCode] || allRobloxServers.filter(s => robloxServerPlaces[s.id]?.c === regionCode);
						if (serversInRegion.length === 0) {
							serverList.textContent = '';
							const rrEmptyP = document.createElement('p');
							rrEmptyP.style.cssText = 'text-align:center;padding:40px 0;font-weight:bold;';
							rrEmptyP.style.color = isDarkMode ? '#aaa' : '#666';
							rrEmptyP.textContent = noServersRegion_Translated;
							serverList.appendChild(rrEmptyP);
						} else {
							serverListState = {
								...serverListState,
								visibleServerCount: 0,
								fetchedServerIds: new Set(),
								renderedServerIds: new Set(),
								servers: serversInRegion,
								loading: false,
								renderedServersData: new Map(),
								currentRegion: regionCode
							};
							sortRobloxServers().then(() => {
								serverListState.viewportHeight = window.innerHeight * 0.7;
								renderServerRegions();
							});
						}
					}

					await showDefaultRightPanel();
					rightBody._showDefault = showDefaultRightPanel;
					rightPanel.append(rightHeader, rightBody);
					modal.append(leftPanel, rightPanel);
					overlay.appendChild(modal);
					body.appendChild(overlay);

					regionListContainer._showRegionServers = showRegionServers;

					await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
					overlay.style.opacity = '1';
					modal.style.transform = 'scale(1)';

					overlay.addEventListener('click', (e) => {
						if (e.target === overlay) closePopup();
					});
				}

				function getRegionContinentInfo(regionCode, coordinatesMap) {
					if (!regionCode || regionCode === '??' || !coordinatesMap || typeof coordinatesMap !== 'object') {
						return unknown_Translated;
					}
					const regionInfo = coordinatesMap[regionCode];
					if (!regionInfo || !regionInfo.country) {
						return unknown_Translated;
					}
					const country = regionInfo.country;
					switch (country) {
						case "United States":
							return "North America";
						case "Germany":
						case "France":
						case "Netherlands":
						case "United Kingdom":
							return "Europe";
						case "Singapore":
						case "Japan":
						case "India":
							return "Asia";
						case "Australia":
							return "Oceania";
						case "Brazil":
							return "South America";
						default:
							return unknown_Translated;
					}
				}
				function rrUpdateIndexedStats() {
					const el = document.getElementById('bloxregion-indexed-stats');
					if (!el) return;
					const total = allRobloxServers.length;
					const regionsCount = Object.keys(regionServerCounting || {}).filter(k => k !== '??' && k !== '???' && (regionServerCounting[k] || 0) > 0).length;
					el.textContent = `Indexed ${total} servers across ${regionsCount} regions.`;
				}
				const RR_EGG_SOUNDS = { 67: 'idk/67.mp3', 770: 'idk/770.mp3' };
				const RR_EGG_CHANCE = 0.01;
				async function rrEnsureRobloxUsername() {
					if (rrRobloxUsername !== 'root') return;
					try {
						const res = await fetch('https://users.roblox.com/v1/users/authenticated', { credentials: 'include' });
						if (!res.ok) return;
						const d = await res.json();
						if (d && d.name) {
							rrRobloxUsername = d.name;
							document.querySelectorAll('.bloxregion-user').forEach(el => el.textContent = rrRobloxUsername);
						}
					} catch (e) {}
				}
				function rrCheckCountEasterEgg(regionsData) {
					for (const r of regionsData) {
						const prev = rrEggLastCounts[r.code] || 0;
						const now = r.count || 0;
						if (now !== prev) rrEggLastCounts[r.code] = now;
						if (rrEggPlayed) continue;
						for (const threshold of [67, 770]) {
							if (prev < threshold && now >= threshold) {
								const key = r.code + ':' + threshold;
								if (rrEggAttempted[key]) continue;
								rrEggAttempted[key] = true;
								if (Math.random() < RR_EGG_CHANCE) {
									rrEggPlayed = true;
									rrEggFreeze[r.code] = threshold;
									try {
										const eggAudio = new Audio(chrome.runtime.getURL(RR_EGG_SOUNDS[threshold]));
										const rrUnfreeze = () => {
											delete rrEggFreeze[r.code];
											const lc = document.getElementById('roregion-region-list-container');
											if (lc) { try { regionServersPopulate(lc); } catch (e) {} }
										};
										eggAudio.addEventListener('ended', rrUnfreeze);
										eggAudio.play().catch(() => rrUnfreeze());
									} catch (e) { delete rrEggFreeze[r.code]; }
									return;
								}
							}
						}
					}
				}
				async function regionServersPopulate(listContainer) {
					rrUpdateIndexedStats();
					if (!listContainer) return;
					const isDarkMode = currentTheme === 'dark';
					listContainer.innerHTML = '';
					if (checkForRefreshingCount && allRobloxServers.length === 0) {
						const rrLoadingDiv = document.createElement('div');
						rrLoadingDiv.style.cssText = 'text-align:center; padding: 20px;';
						rrLoadingDiv.style.color = isDarkMode ? '#aaa' : '#666';
						rrLoadingDiv.textContent = loadingRegions_Translated;
						listContainer.appendChild(rrLoadingDiv);
						return;
					}
					const foundRegionCodes = Object.keys(regionServerCounting).filter(rc => rc !== "??");
					const allKnownRegionCodes = new Set([...defaultRegions, ...foundRegionCodes]);
					const unknownServerCount = regionServerCounting['???'] || 0;
					const regionsData = Array.from(allKnownRegionCodes).map(code => ({
						code: code,
						name: getFullLocationName(code, regionCoordinates),
						count: regionServerCounting[code] || 0,
						continent: getRegionContinentInfo(code, regionCoordinates)
					}));
					try { rrCheckCountEasterEgg(regionsData); } catch (e) {}
					const groupedRegions = regionsData.reduce((acc, region) => {
						const continent = region.continent;
						if (!acc[continent]) {
							acc[continent] = [];
						}
						acc[continent].push(region);
						return acc;
					}, {});
					for (const continent in groupedRegions) {
						groupedRegions[continent].sort((a, b) => {
							if (a.count > 0 && b.count === 0) return -1;
							if (a.count === 0 && b.count > 0) return 1;
							if (robloxProfileUserLocation && typeof robloxProfileUserLocation.latitude === 'number' && typeof robloxProfileUserLocation.longitude === 'number') {
								const coordsA = regionCoordinates[a.code];
								const coordsB = regionCoordinates[b.code];
								if (coordsA && coordsB) {
									const distanceA = calculateDistance(robloxProfileUserLocation.latitude, robloxProfileUserLocation.longitude, coordsA.latitude, coordsA.longitude);
									const distanceB = calculateDistance(robloxProfileUserLocation.latitude, robloxProfileUserLocation.longitude, coordsB.latitude, coordsB.longitude);
									if (!isNaN(distanceA) && !isNaN(distanceB)) {
										return distanceA - distanceB;
									}
								}
							}
							return a.name.localeCompare(b.name);
						});
					}
					const sortedContinents = Object.keys(groupedRegions).sort((a, b) => {
						if (a === unknown_Translated && b !== unknown_Translated) return 1;
						if (a !== unknown_Translated && b === unknown_Translated) return -1;
						if (a === unknown_Translated && b === unknown_Translated) return 0;
						if (robloxProfileUserLocation && typeof robloxProfileUserLocation.latitude === 'number' && typeof robloxProfileUserLocation.longitude === 'number') {
							const avgDistanceA = calculateAverageDistanceForContinent(groupedRegions[a], robloxProfileUserLocation);
							const avgDistanceB = calculateAverageDistanceForContinent(groupedRegions[b], robloxProfileUserLocation);
							if (!isNaN(avgDistanceA) && !isNaN(avgDistanceB)) {
								return avgDistanceA - avgDistanceB;
							}
						}
						const totalServersA = groupedRegions[a].reduce((sum, region) => sum + region.count, 0);
						const totalServersB = groupedRegions[b].reduce((sum, region) => sum + region.count, 0);
						if (totalServersB !== totalServersA) {
							return totalServersB - totalServersA;
						}
						return a.localeCompare(b);
					});

					function calculateAverageDistanceForContinent(regions, userLoc) {
						if (!regions || !regions.length || !userLoc) return NaN;
						let totalDistance = 0;
						let countWithCoords = 0;
						for (const region of regions) {
							const coords = regionCoordinates[region.code];
							if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
								const distance = calculateDistance(userLoc.latitude, userLoc.longitude, coords.latitude, coords.longitude);
								if (!isNaN(distance)) {
									totalDistance += distance;
									countWithCoords++;
								}
							}
						}
						return countWithCoords > 0 ? totalDistance / countWithCoords : NaN;
					}
					let totalServersFound = regionsData.reduce((sum, region) => sum + region.count, 0) + unknownServerCount;
					if (sortedContinents.length === 0 && unknownServerCount === 0 && !checkForRefreshingCount) {
						const rrNoneDiv = document.createElement('div');
						rrNoneDiv.style.cssText = 'text-align:center; padding: 20px;';
						rrNoneDiv.style.color = isDarkMode ? '#aaa' : '#666';
						rrNoneDiv.textContent = noServersFound_Translated;
						listContainer.appendChild(rrNoneDiv);
						return;
					}
					// --- Recommended: 3 regions closest to the player (BloxRegion) ---
					const RR_RECOMMENDED_COUNT = 3;
					const RR_RECOMMENDED_LABEL = 'RECOMMENDED';
					if (robloxProfileUserLocation && typeof robloxProfileUserLocation.latitude === 'number' && typeof robloxProfileUserLocation.longitude === 'number') {
						const rrRecommended = regionsData
							.filter(r => regionCoordinates[r.code])
							.map(r => {
								const c = regionCoordinates[r.code];
								return { region: r, dist: calculateDistance(robloxProfileUserLocation.latitude, robloxProfileUserLocation.longitude, c.latitude, c.longitude) };
							})
							.filter(x => !isNaN(x.dist))
							.sort((a, b) => a.dist - b.dist)
							.slice(0, RR_RECOMMENDED_COUNT)
							.map(x => ({ ...x.region }));
						if (rrRecommended.length > 0) {
							groupedRegions[RR_RECOMMENDED_LABEL] = rrRecommended;
							sortedContinents.unshift(RR_RECOMMENDED_LABEL);
						}
					}
					let isFirstHeader = true;
					sortedContinents.forEach(continent => {
						const regionsInGroup = groupedRegions[continent];
						if (regionsInGroup.length === 0 && continent !== unknown_Translated) return;
						const header = document.createElement('div');
						const rrIsRec = continent === RR_RECOMMENDED_LABEL;
						const rrHdrSlash = document.createElement('span');
						rrHdrSlash.style.color = '#00ff9c';
						rrHdrSlash.textContent = '//';
						const rrHdrName = document.createElement('span');
						rrHdrName.style.color = rrIsRec ? '#00ff9c' : '#5a6a5a';
						rrHdrName.textContent = (rrIsRec ? '\u2605 ' : '') + continent;
						header.append(rrHdrSlash, ' ', rrHdrName);
						header.style.cssText = `
            padding: 10px 14px 4px 14px; font-size: 11px;
            font-weight: 700; letter-spacing: 0.1em;
            text-transform: uppercase;
            border-top: ${isFirstHeader ? 'none' : `1px solid #1a2a1f`};
            margin-top: ${isFirstHeader ? '0px' : '4px'};
            background-color: transparent;
            position: relative; z-index: 1;
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
        `;
						listContainer.appendChild(header);
						isFirstHeader = false;
						regionsInGroup.forEach((region, index) => {
							const {
								code: regionCode,
								name: fullName,
								count
							} = region;
							const listItem = document.createElement('div');
							listItem.className = 'roregion-region-item';
							listItem.style.cssText = `
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 10px 8px 14px; cursor: ${count > 0 ? 'pointer' : 'default'};
                transition: background-color 0.15s ease, border-left-color 0.15s ease;
                opacity: ${count > 0 ? '1' : '0.45'};
                background-color: transparent; gap: 6px;
                border-left: 2px solid transparent;
                font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
            `;
							if (count > 0) {
								listItem.onmouseover = (e) => {
									if (!isScrollingList && !e.target.closest('.roregion-quick-play')) {
										listItem.style.backgroundColor = 'rgba(0,255,156,0.06)';
										listItem.style.borderLeftColor = '#00ff9c';
									}
								};
								listItem.onmouseout = (e) => {
									if (!e.relatedTarget || !listItem.contains(e.relatedTarget)) {
										listItem.style.backgroundColor = 'transparent';
										listItem.style.borderLeftColor = 'transparent';
									}
								};
								listItem.onclick = (e) => {
									if (e.target.closest('.roregion-quick-play')) return;
									const showRegionFn = listContainer._showRegionServers;
									if (showRegionFn) {
										showRegionFn(regionCode);
									} else if (regionSelectorShowServerListOverlay) {
										regionOverlaySystem(regionCode);
									} else {
										joinSpecificRegion(regionCode);
									}
									const dropdown = document.getElementById('regionDropdown');
									if (dropdown) dropdown.style.display = 'none';
								};
							} else {

							}
							const nameSpan = document.createElement('span');
							nameSpan.style.cssText = `font-size: 13px; font-weight: 500; color: #c8d4c8; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;`;
							const codeTag = document.createElement('span');
							codeTag.textContent = `[${regionCode}]`;
							codeTag.style.cssText = `color: #00ff9c; font-weight: 700; flex-shrink: 0; font-size: 11px;`;
							nameSpan.appendChild(codeTag);
							const flagUrl = getRegionFlag(regionCode);
							if (flagUrl) {
								const flagImg = document.createElement('img');
								flagImg.src = flagUrl;
								flagImg.style.cssText = 'width:18px;height:13px;object-fit:cover;border-radius:1px;vertical-align:middle;flex-shrink:0;opacity:0.85;';
								nameSpan.appendChild(flagImg);
							}
							const nameText = document.createElement('span');
							nameText.textContent = fullName;
							nameText.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
							nameSpan.appendChild(nameText);

							const rightSide = document.createElement('div');
							rightSide.style.cssText = 'display: flex; align-items: center; gap: 6px; flex-shrink: 0;';

							const countSpan = document.createElement('span');
							countSpan.textContent = String(rrEggFreeze[regionCode] != null ? rrEggFreeze[regionCode] : count);
							countSpan.style.cssText = `
                font-size: 12px; font-weight: 700;
                color: ${count > 0 ? '#00ff9c' : '#3a4a3a'};
                background-color: transparent;
                border: 1px solid ${count > 0 ? '#2d6a4d' : '#1a2a1f'};
                padding: 0 8px; border-radius: 3px; white-space: nowrap;
                height: 24px; min-width: 28px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box;
                font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
            `;
							rightSide.appendChild(countSpan);

							if (count > 0) {
								const quickPlayBtn = document.createElement('button');
								quickPlayBtn.className = 'roregion-quick-play';

								quickPlayBtn.innerHTML = `<span style="font-family:'JetBrains Mono','Courier New',monospace;font-weight:900;font-size:14px;letter-spacing:-1px;">&gt;_</span>`;
								quickPlayBtn.style.cssText = `
									width: 42px; height: 24px; border-radius: 3px; border: 1px solid #2d6a4d; cursor: pointer;
									background-color: transparent; color: #00ff9c;
									display: flex; align-items: center; justify-content: center;
									flex-shrink: 0; transition: all 0.15s ease; padding: 0;
									position: relative; z-index: 2; isolation: isolate;
								`;
								quickPlayBtn.onmouseover = (e) => { e.stopPropagation(); quickPlayBtn.style.background = 'rgba(0,255,156,0.15)'; quickPlayBtn.style.borderColor = '#00ff9c'; listItem.style.backgroundColor = 'transparent'; };
								quickPlayBtn.onmouseout = (e) => { e.stopPropagation(); quickPlayBtn.style.background = 'transparent'; quickPlayBtn.style.borderColor = '#2d6a4d'; };
								quickPlayBtn.onclick = async (e) => {
									e.stopPropagation();
									joinSpecificRegion(regionCode);
									const overlay = document.getElementById('roregion-unified-overlay');
									if (overlay) overlay.remove();
									document.body.style.overflow = 'auto';
								};
								rightSide.appendChild(quickPlayBtn);
							}

							listItem.append(nameSpan, rightSide);
							listContainer.appendChild(listItem);
						});
					});
					if (unknownServerCount > 0) {
						let unknownHeader = Array.from(listContainer.children).find(child => child.tagName === 'DIV' && child.textContent === unknown_Translated && child.style.fontWeight === '600');
						if (!unknownHeader) {
							unknownHeader = document.createElement('div');
							unknownHeader.textContent = unknown_Translated;
							unknownHeader.style.cssText = `
                padding: 8px 12px 4px 12px; font-size: 12px;
                font-weight: 600; color: ${isDarkMode ? '#eeeeee' : '#555555'};
                text-transform: uppercase; letter-spacing: 0.5px;
                border-top: ${listContainer.children.length === 0 ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`};
                margin-top: ${listContainer.children.length === 0 ? '0px' : '8px'};
                background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
                position: relative; z-index: 1;
             `;
							listContainer.appendChild(unknownHeader);
						}
						const listItem = document.createElement('div');
						listItem.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 12px; cursor: default;
            border-top: ${unknownHeader.nextElementSibling === null ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`};
            opacity: 1;
            background-color: transparent;
        `;
						listItem.onmouseover = null;
						listItem.onmouseout = null;
						listItem.onclick = null;

						const nameSpan = document.createElement('span');
						nameSpan.textContent = unknownLocation_Translated;
						nameSpan.style.cssText = `font-size: 14px; font-weight: 500; color: ${isDarkMode ? '#e0e0e0' : '#333333'};`;
						const countSpan = document.createElement('span');
						countSpan.textContent = (unknownServerCount === 1 ? serversText_Translated : serversText_Plural_Translated).replace('SERVER_COUNT', unknownServerCount);
						countSpan.style.cssText = `
            font-size: 13px; font-weight: 400;
            color: ${isDarkMode ? '#a0a0a0' : '#666666'};
            background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
            padding: 2px 6px; border-radius: 4px;
        `;
						listItem.append(nameSpan, countSpan);
						listContainer.insertBefore(listItem, unknownHeader.nextSibling);
					}

					const fetchingFooter = document.getElementById('roregion-fetching-footer');
					if (fetchingFooter) {
						fetchingFooter.style.display = (checkForRefreshingCount && allRobloxServers.length > 0) ? 'flex' : 'none';
					}
				}
				async function regionOverlaySystem(region) {
					if (document.getElementById('roregion-unified-overlay')) return;
					await openRoRegionPopup();
					setTimeout(() => {
						const lc = document.getElementById('roregion-region-list-container');
						if (lc && lc._showRegionServers) lc._showRegionServers(region);
					}, 50);
				}
				function setupRenderingServers() {
					return;
				}
				async function renderServerRegions() {
					const listElement = document.getElementById('roregion-actual-server-list');
					if (!listElement) return;
					const isDarkMode = currentTheme === 'dark';
					listElement.innerHTML = '';
					serverListState.visibleServerCount = 0;
					serverListState.renderedServerIds.clear();
					serverListState.loading = false;
					if (serverListState.servers.length === 0) {
						listElement.textContent = '';
						const rrNoActive = document.createElement('p');
						rrNoActive.style.cssText = 'text-align:center; padding: 40px 0; font-weight:bold;';
						rrNoActive.style.color = isDarkMode ? '#aaa' : '#666';
						rrNoActive.textContent = noActiveServers_Translated;
						listElement.appendChild(rrNoActive);
						return;
					}
					const loadingPlaceholder = document.createElement('div');
					loadingPlaceholder.style.cssText = `color: transparent;`;
					listElement.appendChild(loadingPlaceholder);
					setTimeout(async () => {
						try {
							const initialServers = serverListState.servers.slice(0, BATCH_SIZE);
							let thumbnailUrls = {};
							const allTokens = initialServers.flatMap(server => server.playerTokens || []);
							const uniqueTokens = [...new Set(allTokens)].filter(token => token);
							const tokenBatches = [];
							for (let i = 0; i < uniqueTokens.length; i += THUMBNAIL_BATCH_SIZE) {
								tokenBatches.push(uniqueTokens.slice(i, i + THUMBNAIL_BATCH_SIZE));
							}
							const thumbnailPromises = tokenBatches.map(batch => fetchThumbnailAssets(batch));
							const thumbnailResults = await Promise.all(thumbnailPromises);
							thumbnailUrls = thumbnailResults.reduce((acc, result) => ({
								...acc,
								...result
							}), {});
							Object.entries(thumbnailUrls).forEach(([token, url]) => {
								thumbnailCache.set(token, url);
							});
							const fragment = document.createDocumentFragment();
							const serverEntries = [];
							for (const server of initialServers) {
								const serverId = server.id;
								if (serverListState.renderedServerIds.has(serverId)) continue;
								let serverEntry = serverEntryCache.get(serverId);
								if (!serverEntry) {
									serverEntry = createServerFetch(server, thumbnailUrls, isDarkMode);
									serverEntryCache.set(serverId, serverEntry);
								}
								serverEntries.push(serverEntry);
								serverListState.renderedServerIds.add(serverId);
							}
							serverEntries.forEach(entry => fragment.appendChild(entry));
							listElement.innerHTML = '';
							listElement.appendChild(fragment);
							serverListState.visibleServerCount = initialServers.length;
							if (serverListState.servers.length > BATCH_SIZE) {
								loadButtonMore(listElement, isDarkMode);
							}
						} catch (error) {
							console.error('Error loading initial servers:', error);
							loadingPlaceholder.textContent = errorLoadingServers_Translated;
						}
					}, 0);
				}
				function loadButtonMore(listElement, isDarkMode) {
					const loadMoreButton = document.createElement('button');
					loadMoreButton.textContent = loadMoreServers_Translated;
					loadMoreButton.style.cssText = `
                    grid-column: 1 / -1;
                    margin: 8px auto 0;
                    padding: 9px 28px;
                    background-color: ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
                    color: ${isDarkMode ? '#bbb' : '#555'};
                    border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'};
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    display: block;
                    transition: opacity 0.2s ease;
                `;
					let isLoading = false;
					loadMoreButton.onclick = async () => {
						if (isLoading) return;
						isLoading = true;
						loadMoreButton.style.opacity = '0.7';
						loadMoreButton.textContent = loading_Translated;
						try {
							const nextBatch = serverListState.servers.slice(serverListState.visibleServerCount, serverListState.visibleServerCount + BATCH_SIZE);
							if (nextBatch.length > 0) {
								let nextThumbnailUrls = {};
								const nextTokens = nextBatch.flatMap(server => server.playerTokens || []);
								const uniqueTokens = [...new Set(nextTokens)].filter(token => token);
								const uncachedTokens = uniqueTokens.filter(token => !thumbnailCache.has(token));
								if (uncachedTokens.length > 0) {
									const tokenBatches = [];
									for (let i = 0; i < uncachedTokens.length; i += THUMBNAIL_BATCH_SIZE) {
										tokenBatches.push(uncachedTokens.slice(i, i + THUMBNAIL_BATCH_SIZE));
									}
									const thumbnailPromises = tokenBatches.map(batch => fetchThumbnailAssets(batch));
									const thumbnailResults = await Promise.all(thumbnailPromises);
									nextThumbnailUrls = thumbnailResults.reduce((acc, result) => ({
										...acc,
										...result
									}), {});
									Object.entries(nextThumbnailUrls).forEach(([token, url]) => {
										thumbnailCache.set(token, url);
									});
								}
								const nextFragment = document.createDocumentFragment();
								const serverEntries = [];
								for (const server of nextBatch) {
									const serverId = server.id;
									if (serverListState.renderedServerIds.has(serverId)) continue;
									let serverEntry = serverEntryCache.get(serverId);
									if (!serverEntry) {
										serverEntry = createServerFetch(server, {
											...Object.fromEntries(thumbnailCache),
											...nextThumbnailUrls
										}, isDarkMode);
										serverEntryCache.set(serverId, serverEntry);
									}
									serverEntries.push(serverEntry);
									serverListState.renderedServerIds.add(serverId);
								}
								serverEntries.forEach(entry => nextFragment.appendChild(entry));
								listElement.insertBefore(nextFragment, loadMoreButton);
								serverListState.visibleServerCount += nextBatch.length;
								if (serverListState.visibleServerCount >= serverListState.servers.length) {
									loadMoreButton.remove();
								}
							}
						} catch (error) {
							console.error('Error loading more servers:', error);
							loadMoreButton.textContent = errorLoadingMore_Translated;
						} finally {
							isLoading = false;
							loadMoreButton.style.opacity = '1';
							loadMoreButton.textContent = loadMoreServers_Translated;
						}
					};
					listElement.appendChild(loadMoreButton);
				}
				const style = document.createElement('style');
				style.textContent = `
                .server-entry {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 14px 16px;
                    margin-bottom: 12px;
                    border-radius: 4px;
                    background-color: #0a0f0c;
                    border: 1px solid #1a2a1f;
                    color: #c8d4c8;
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .server-entry.dark, .server-entry.light {
                    background-color: #0a0f0c;
                    color: #c8d4c8;
                }
                .server-entry:hover {
                    border-color: #2d6a4d;
                    box-shadow: 0 0 0 1px rgba(0,255,156,0.08);
                }

                .profile-pictures-row {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 4px;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    width: 100%;
                }

                .profile-thumbnail {
                    border-radius: 50%;
                    object-fit: cover;
                    background-color: #555;
                    flex: 1 1 0;
                    min-width: 0;
                    max-width: 55px;
                    aspect-ratio: 1 / 1;
                    height: auto;
                }

                .plus-count {
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 13px;
                    font-weight: 600;
                    flex: 1 1 0;
                    min-width: 0;
                    max-width: 55px;
                    aspect-ratio: 1 / 1;
                }

                .plus-count.dark {
                    background-color: rgba(255, 255, 255, 0.15);
                    color: #b0b0b0;
                }

                .plus-count.light {
                    background-color: rgba(0, 0, 0, 0.08);
                    color: #555;
                }

                .info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .player-count-text {
                    font-size: 16px;
                    font-weight: 600;
                }

                .player-count-text.dark {
                    color: #d0d0d0;
                }

                .player-count-text.light {
                    color: #444;
                }

                .ping-container {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 15px;
                    vertical-align: middle;
                }

                .bottom-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                    margin-top: 5px;
                    width: 100%;
                }

                .buttons-container {
                    display: flex;
                    gap: 8px;
                    width: 100%;
                }

                .server-button {
                    border-radius: 6px;
                    padding: 8px 18px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .join-button {
                    background-color: #3975e0;
                    color: white;
                    border: none;
                }

                .join-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .join-button:disabled.dark {
                    background-color: #555;
                }

                .join-button:disabled.light {
                    background-color: #ccc;
                }

                .share-button {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #c0c0c0;
                    border: none;
                }

                .share-button.light {
                    background-color: rgba(0, 0, 0, 0.06);
                    color: #444;
                }

                .server-id-display {
                    text-align: right;
                    font-size: 3px;
                    font-weight: 500;
                    font-family: monospace;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .server-id-display.dark {
                    color: #888;
                }

                .server-id-display.light {
                    color: #777;
                }
            `;
				document.head.appendChild(style);
				function createServerFetch(server, thumbnailUrls, isDarkMode) {
					const serverId = server.id;
					const playing = server.playing || 0;
					const max = server.maxPlayers || '?';
					const serverEntry = document.createElement('div');
					serverEntry.className = `server-entry ${isDarkMode ? 'dark' : 'light'}`;
					serverEntry.dataset.serverId = serverId;

					const pillRow = document.createElement('div');
					pillRow.style.cssText = `display: flex; align-items: center; justify-content: flex-start; padding: 0;`;
					const countPill = document.createElement('div');
					countPill.style.cssText = `
						display: inline-flex; align-items: center; gap: 8px;
						padding: 3px 10px; border-radius: 3px;
						background-color: transparent;
						border: 1px solid ${playing > 0 ? '#2d6a4d' : '#1a2a1f'};
						font-size: 12px; font-weight: 700;
						color: ${playing > 0 ? '#00ff9c' : '#5a6a5a'};
						font-family: inherit;
					`;
					const dot = document.createElement('span');
					dot.style.cssText = `width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background-color: ${playing > 0 ? '#00ff9c' : '#3a4a3a'}; box-shadow: 0 0 6px ${playing > 0 ? 'rgba(0,255,156,0.55)' : 'transparent'};`;
					const pillLabel = document.createElement('span');
					pillLabel.textContent = playing > 0 ? `${playing}/${max} players` : 'no players';
					countPill.append(dot, pillLabel);
					pillRow.appendChild(countPill);
					serverEntry.appendChild(pillRow);

					const profilePicturesRow = document.createElement('div');
					profilePicturesRow.className = 'profile-pictures-row';
					const playerTokens = server.playerTokens || [];
					const maxThumbnails = 5;
					const playersToShow = Math.min(playing, playerTokens.length, maxThumbnails);
					for (let i = 0; i < playersToShow; i++) {
						const token = playerTokens[i];
						if (!token) continue;
						const profileImg = document.createElement('img');
						profileImg.className = 'profile-thumbnail';
						profileImg.src = thumbnailUrls[token] || `https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png`;
						profileImg.alt = `Player ${i+1}`;
						profilePicturesRow.appendChild(profileImg);
					}
					if (playing === 0 && playerTokens.length === 0) {
						const noPlayersText = document.createElement('div');
						noPlayersText.textContent = noPlayersOnline_Translated;
						noPlayersText.style.cssText = `
							font-size: 14px;
							color: ${isDarkMode ? '#888' : '#777'};
							font-style: italic;
							padding: 8px 0;
							line-height: 60px;
						`;
						profilePicturesRow.appendChild(noPlayersText);
					}
					serverEntry.appendChild(profilePicturesRow);

					const infoSection = document.createElement('div');
					infoSection.className = 'info-section';
					const pingContainer = document.createElement('div');
					pingContainer.className = 'ping-container';
					let pingValue = server.calculatedPing;
					let pingDisplay = '~ ??ms';
					let pingColor = '#5a6a5a';
					if (pingValue !== undefined && !isNaN(pingValue) && pingValue !== Infinity) {
						pingDisplay = `~ ${Math.round(pingValue)}ms`;
						if (pingValue < 80) pingColor = '#00ff9c';
						else if (pingValue < 150) pingColor = '#febc2e';
						else pingColor = '#ff5f57';
					}
					const pingText = document.createElement('span');
					const rrPingLbl = document.createElement('span');
					rrPingLbl.style.color = '#5a6a5a';
					rrPingLbl.textContent = 'ping:';
					const rrPingVal = document.createElement('span');
					rrPingVal.style.color = pingColor;
					rrPingVal.style.fontWeight = '700';
					rrPingVal.textContent = pingDisplay;
					pingText.append(rrPingLbl, ' ', rrPingVal);
					pingText.style.fontFamily = 'inherit';
					pingText.style.fontSize = '12px';
					pingContainer.appendChild(pingText);
					infoSection.appendChild(pingContainer);
					serverEntry.appendChild(infoSection);
					const bottomRow = document.createElement('div');
					bottomRow.className = 'bottom-row';
					const buttonsContainer = document.createElement('div');
					buttonsContainer.className = 'buttons-container';
					const joinButton = document.createElement('button');
					joinButton.type = 'button';
					joinButton.className = 'btn-common-play-game-lg btn-primary-md btn-full-width';
					joinButton.setAttribute('data-testid', 'play-button');
					joinButton.innerHTML = `<span style="font-family:'JetBrains Mono','Courier New',monospace;font-weight:900;letter-spacing:1px;">$ join &gt;_</span>`;
					const _full = server.playing >= server.maxPlayers;
					joinButton.style.cssText = `
						width: 100%; height: 40px;
						border-radius: 3px;
						background: transparent;
						color: ${_full ? '#3a4a3a' : '#00ff9c'};
						border: 1px solid ${_full ? '#1a2a1f' : '#2d6a4d'};
						cursor: ${_full ? 'not-allowed' : 'pointer'};
						opacity: ${_full ? '0.55' : '1'};
						display: flex; align-items: center; justify-content: center;
						transition: all 0.15s ease;
						font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
						font-size: 13px; font-weight: 700; letter-spacing: 0.03em;
					`;
					joinButton.disabled = server.playing >= server.maxPlayers;
					if (!joinButton.disabled) {
						joinButton.onmouseover = () => { joinButton.style.background = 'rgba(0,255,156,0.12)'; joinButton.style.borderColor = '#00ff9c'; };
						joinButton.onmouseout = () => { joinButton.style.background = 'transparent'; joinButton.style.borderColor = '#2d6a4d'; };
						joinButton.onclick = async () => {
							joinSpecificServer(serverId);
							const unifiedOverlay = document.getElementById('roregion-unified-overlay');
							if (unifiedOverlay) {
								unifiedOverlay.style.opacity = '0';
								setTimeout(() => { unifiedOverlay.remove(); document.body.style.overflow = 'auto'; }, 200);
								return;
							}
							const overlay = document.getElementById('roregion-server-list-overlay');
							if (overlay) {
								const actualCloseButton = overlay.querySelector('#roregion-overlay-close-button');
								if (actualCloseButton) {
									actualCloseButton.click();
								} else {
									overlay.remove();
									document.body.style.overflow = "auto";
								}
							}
						};
					}
					buttonsContainer.append(joinButton);
					bottomRow.append(buttonsContainer);
					serverEntry.appendChild(bottomRow);
					return serverEntry;
				}
				async function sortRobloxServers() {
						const sortValue = serverListState.currentSort;
						await Promise.all(serverListState.servers.map(async server => {
							if (server.calculatedPing === undefined || isNaN(server.calculatedPing) || server.calculatedPing === Infinity) {
								const serverLoc = robloxServerPlaces[server.id]?.l;
								if (robloxProfileUserLocation && serverLoc && typeof serverLoc.latitude === 'number') {
									const dist = calculateDistance(robloxProfileUserLocation.latitude, robloxProfileUserLocation.longitude, serverLoc.latitude, serverLoc.longitude);
									if (!isNaN(dist)) {
										server.calculatedPing = Math.round(dist * 0.05);
									} else {
										server.calculatedPing = Infinity;
									}
								} else {
									server.calculatedPing = Infinity;
								}
							}
						}));
						serverListState.servers.sort((a, b) => {
							const pingA = a.calculatedPing ?? Infinity,
								pingB = b.calculatedPing ?? Infinity;
							const playersA = a.playing ?? -1,
								playersB = b.playing ?? -1;
							const maxA = a.maxPlayers || Infinity,
								maxB = b.maxPlayers || Infinity;
							const isFullA = playersA >= maxA,
								isFullB = playersB >= maxB;
							switch (sortValue) {
								case 'ping_lowest':
									return pingA - pingB || playersB - playersA;
								case 'ping_highest': {
									const aUnknown = pingA === Infinity, bUnknown = pingB === Infinity;
									if (aUnknown !== bUnknown) return aUnknown ? 1 : -1;
									return pingB - pingA || playersB - playersA;
								}
								case 'players_highest':
									return (isFullA === isFullB ? 0 : isFullA ? 1 : -1) || playersB - playersA || pingA - pingB;
								case 'players_lowest':
									return (isFullA - isFullB) || playersA - playersB || pingA - pingB;
								default:
									return 0;
							}
						});
					}
					(async () => {
						await applyTheme();
						await updateRegionSelectorState();
						if (!regionSelectorEnabled) {
							return;
						}
						if (!placeId) {
							return;
						}

						let waitCount = 0;
						while (serverIpMap === null && waitCount < 25) {
							await delay(200);
							waitCount++;
						}
						if (serverIpMap === null) {
							serverIpMap = {};
						} else {}
						await updateDetailsServers();
						await getServerInfo(placeId, null, defaultRegions, true);
					})();
			}
		} else {}
	});
}

regionSelectorInitiate()