const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "index.html";

} else {
    var kabupatenList = [];
    var kecamatanList = [];
    var desaList = [];
    var perkerasanList = [];
    var kondisiList = [];
    var jenisList = [];

    var selectedKabupaten = "";
    var selectedKecamatan = "";
    var selectedDesa= "";
    var selectedPerkerasan = "";
    var selectedKondisi = "";
    var selectedJenis = "";

    var selectedKabupatenId = 0;
    var selectedKecamatanId = 0;
    var selectedDesaId = 0;
    var selectedPerkerasanId = 0;
    var selectedKondisiId = 0;
    var selectedJenisId = 0;
    var totalDistance = 0;
    var encodedPath = "";
    
    var desaGet = [];
    var kecamatanGet = [];
    var kabupatenGet = [];
    var ruasJalanGet = [];
    var ruasJalanGetFull = [];

    var desaNama = "";
    var kecamatanNama = "";
    var kabupatenNama = "";
    var kabupatenIdSend = 0;
    var kecamatanIdSend = 0;

    var desaKecId = 0;
    var kecKabId = 0;

    var idRuasJalan = 0;
    var idClicked = 0;
    var perkerasanLoad = []
    var perkerasanNama = "";

    var kondisiLoad = []
    var kondisiNama = "";

    var jenisLoad = []
    var jenisNama = "";

    var string = 0;

    var namaRuas = "";
    var lebarRuas = "";
    var keteranganRuas = "";
    var kodeRuas = "";

    var flag = 0;
    var flagDelete = "";

    const checkboxJalanRusak = document.getElementById('jalan_rusak');
    const checkboxJalanSedang = document.getElementById('jalan_sedang');
    const checkboxJalanBaik = document.getElementById('jalan_baik');
    const lihat_tabel = document.getElementById("lihat-ruas");

    if (selectedKabupatenId == 0) {
        document.querySelector("#overlay-data").style.display = "none";
    } else {
        document.querySelector("#overlay-data").style.display = "absolute";
    }
    
    const textWelcome = document.getElementById("welcome")
    textWelcome.textContent = `Welcome Explorer!`;
    var flagUntukDelete = localStorage.getItem("flagDelete")

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector(".notifikasi").style.display = "block";
    
        getAllJenisJalan();
        getAllKondisiJalan();
        getAllDataPerkerasan();
        getDataAllDesaKecamatanKabupaten();
        loadSavedPolylines();
        updateEncodedPath([]); // Initialize with empty path
        console.log(flagUntukDelete == "yes");
       
        if (flagUntukDelete == "yes") {
            document.getElementById("yes-display").dispatchEvent(new Event('click'));
        }
    });    
    
    document.getElementById("yes-display").addEventListener("click", function(event){
        event.preventDefault();
        console.log('yes-display is clicked');
    
        getAllJenisJalan();
        getAllKondisiJalan();
        getAllDataPerkerasan();
        getDataAllDesaKecamatanKabupaten();
        loadSavedPolylines();
        updateEncodedPath([]); // Initialize with empty path
    
        document.querySelector(".notifikasi").style.display = "none";
        checkboxJalanRusak.checked = true;
        checkboxJalanBaik.checked = true;
        checkboxJalanSedang.checked = true;
    
        checkboxJalanRusak.dispatchEvent(new Event('change'));
        checkboxJalanBaik.dispatchEvent(new Event('change'));
        checkboxJalanSedang.dispatchEvent(new Event('change'));
    
        if (flagUntukDelete == "yes") {
            document.getElementById("loading-spinner").style.display = "block";
            document.getElementById("table-overlay").style.display = "none";
            document.getElementById("checkbox-road-view").style.display = "none";
        
            console.log('flagUntukDelete is yes show table');
            console.log(`Ini Flag Benar: ${ruasJalanGet}`);
        
            console.log(ruasJalanGet);
        
            setTimeout(function() {
                populateTable(ruasJalanGet, ruasJalanGetFull);
                
                document.getElementById("loading-spinner").style.display = "none";
                document.getElementById("table-overlay").style.display = "block";
        
                const tanahFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 1;
                });
        
                const tanahBetonFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 2;
                });
        
                const perkerasanBahanFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 3;
                });
        
                const koralFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 4;
                });
        
                const lapenFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 5;
                });
        
                const pavingFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 6;
                });
        
                const hotmixFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 7;
                });
        
                const betonFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 8;
                });
        
                const betonLapenFilter = ruasJalanGetFull.filter(function(data) {
                    return data.id_perkerasan == 9;
                });
        
                tanahCount = tanahFilter.length;
                tanahBetonCount = tanahBetonFilter.length;
                perkerasanBahanCount = perkerasanBahanFilter.length;
                koralCount = koralFilter.length;
                lapenCount = lapenFilter.length;
                pavingCount = pavingFilter.length;
                hotmixCount = hotmixFilter.length;
                betonCount = betonFilter.length;
                betonLapenCount = betonLapenFilter.length;

                document.getElementById("tanah").textContent += `${tanahCount}`;
                document.getElementById("tanah-beton").textContent += `${tanahBetonCount}`;
                document.getElementById("perkerasanbahan").textContent += `${perkerasanBahanCount}`;
                document.getElementById("koral").textContent += `${koralCount}`;
                document.getElementById("lapen").textContent += `${lapenCount}`;
                document.getElementById("paving").textContent += `${pavingCount}`;
                document.getElementById("hotmix").textContent += `${hotmixCount}`;
                document.getElementById("beton").textContent += `${betonCount}`;
                document.getElementById("beton-lapen").textContent += `${betonLapenCount}`;
            }, 1000); 
            
            localStorage.removeItem("flagDelete");
        }
    });
    

    var map = L.map('map').setView([-8.8008012, 115.1612023], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    navigator.geolocation.getCurrentPosition(position => {
        const { coords: { latitude, longitude }} = position;
    
        var myIcon = L.icon({
            iconUrl: 'icon/your_loc.png',
            iconSize: [35, 40],
            iconAnchor: [16, 10],
        });
        
        var marker = new L.marker([latitude, longitude], {
        draggable: false,
        icon: myIcon,
        autoPan: true
        }).addTo(map);
    
        map.setView([latitude, longitude], 10);
    
        marker.bindPopup("<b>You're here!").openPopup();
        console.log(marker);
    })

    // Array to hold the markers
    var markers = [];

    // Create a polyline and add it to the map with thicker weight
    var polyline = L.polyline([], {color: 'red', weight: 5}).addTo(map); // Weight set to 5 for thicker polyline

    // Function to update the polyline based on marker positions
    function updatePolyline() {
        var latlngs = markers.map(marker => marker.getLatLng());
        polyline.setLatLngs(latlngs);
        updateLength();
        updateEncodedPath(latlngs); // Update encoded path
    }

    // Function to calculate the total length of the polyline
    function updateLength() {
        var latlngs = polyline.getLatLngs();

        for (var i = 0; i < latlngs.length - 1; i++) {
            totalDistance += latlngs[i].distanceTo(latlngs[i + 1]);
        }

        // Display the total distance in the input field in meters
        console.log('Total Distance: ' + totalDistance.toFixed(2) + ' meters');
    }

    // Function to encode the path
    function encodePath(latlngs) {
        var result = '';

        var encode = function(num) {
            num = num < 0 ? ~(num << 1) : num << 1;
            var encoded = '';
            while (num >= 0x20) {
                encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
                num >>= 5;
            }
            encoded += String.fromCharCode(num + 63);
            return encoded;
        };

        var prevLat = 0, prevLng = 0;

        for (var i = 0; i < latlngs.length; i++) {
            var lat = Math.round(latlngs[i].lat * 1e5);
            var lng = Math.round(latlngs[i].lng * 1e5);

            result += encode(lat - prevLat);
            result += encode(lng - prevLng);

            prevLat = lat;
            prevLng = lng;
        }

        return result;
    }

    // Function to update the encoded path variable
    function updateEncodedPath(latlngs) {
        encodedPath = encodePath(latlngs);
        console.log('Encoded Path:', encodedPath);
    }

    var inputMode = 'belakang';

    document.getElementById("reverse-mark").addEventListener("click", function(event) {
        event.preventDefault();
        inputMode = 'depan';
    });

    document.getElementById("reverse-back-mark").addEventListener("click", function(event) {
        event.preventDefault();
        inputMode = 'belakang';
    });

    var marker = [];

    // Event listener for map clicks
    map.on('click', function(e) {
        marker = L.marker(e.latlng, {draggable: true}).addTo(map);
        marker.on('drag', updatePolyline);

        if (inputMode == 'depan') {
            markers.unshift(marker);
        } else {
            markers.push(marker);
        }

        updatePolyline();

        if (flag == 0) {
            document.getElementById("hapus-marker").style.display = "block";
        }
        
        document.getElementById("panjang-data").textContent = totalDistance.toFixed(2) + ' meters';
    });
    
    document.getElementById("hapus-marker").addEventListener("click", function(event){
        event.preventDefault();
        // Hapus semua marker dari peta
        document.getElementById("hapus-marker").style.display = "none";
        
        markers.forEach(function(marker) {
            map.removeLayer(marker);
        });

        map.removeLayer(marker);

        // Kosongkan array markers
        markers = [];

        // Kosongkan polyline
        polyline.setLatLngs([]);

        // Perbarui jarak total
        updateDistance();
    });

    document.getElementById("delete-mark").addEventListener("click", function(event){
        event.preventDefault();
        // Hapus semua marker dari peta
        document.getElementById("hapus-marker").style.display = "none";
        
        markers.forEach(function(marker) {
            map.removeLayer(marker);
        });

        map.removeLayer(marker);

        // Kosongkan array markers
        markers = [];

        // Kosongkan polyline
        polyline.setLatLngs([]);

        // Perbarui jarak total
        updateDistance();
    });

    function decodePath(encoded) {
        var len = encoded.length;
        var index = 0;
        var lat = 0;
        var lng = 0;
        var array = [];
    
        while (index < len) {
            var b;
            var shift = 0;
            var result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
            lat += dlat;
    
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
            lng += dlng;
    
            array.push([lat / 1e5, lng / 1e5]);
        }
    
        return array;
    }
    
    function getAllJenisJalan() {
        const apiUrlJenis = `https://gisapis.manpits.xyz/api/mjenisjalan`;
                
        const requestOptionsJenis = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlJenis, requestOptionsJenis)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            data.eksisting.forEach(function(jenisjalan) {
                const existingItem = jenisLoad.find(item => item.id === jenisjalan.id);

                if (!existingItem) {
                    jenisLoad.push({ id: jenisjalan.id, value: jenisjalan.jenisjalan });
                    console.log(jenisjalan.id, jenisjalan.jenisjalan);
                }
            });
        })
        .catch(error => {
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    }

    function getAllKondisiJalan() {
        const apiUrlKondisi = `https://gisapis.manpits.xyz/api/mkondisi`;
                
        const requestOptionsKondisi = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlKondisi, requestOptionsKondisi)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            data.eksisting.forEach(function(kondisi) {
                const existingItem = kondisiLoad.find(item => item.id === kondisi.id);

                if (!existingItem) {
                    kondisiLoad.push({ id: kondisi.id, value: kondisi.kondisi });
                    console.log(kondisi.id, kondisi.kondisi);
                }
            });
            
        })
        .catch(error => {
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    }

    function getAllDataPerkerasan() {
        const apiUrlPerkerasan = `https://gisapis.manpits.xyz/api/meksisting`;
                
        const requestOptionsPerkerasan = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlPerkerasan, requestOptionsPerkerasan)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            data.eksisting.forEach(function(eksisting) {
                const existingItem = perkerasanLoad.find(item => item.id === eksisting.id);

                if (!existingItem) {
                    perkerasanLoad.push({ id: eksisting.id, value: eksisting.eksisting });
                }
            });
        })
        .catch(error => {
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    }

    function getDataAllDesaKecamatanKabupaten() {
        const apiGetAll = "https://gisapis.manpits.xyz/api/mregion"

        const requestOptionsGetAll = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiGetAll, requestOptionsGetAll)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            desaGet = []
            kecamatanGet = []
            kabupatenGet = []

            data.desa.forEach(function(desa){
                desaGet.push({id: desa.id, kec_id: desa.kec_id, desa: desa.desa});
            })

            data.kecamatan.forEach(function(kecamatan){
                kecamatanGet.push({id: kecamatan.id, kab_id: kecamatan.kab_id, kecamatan: kecamatan.kecamatan});
            })

            data.kabupaten.forEach(function(kabupaten){
                kabupatenGet.push({id: kabupaten.id, prov_id: kabupaten.prov_id, kabupaten: kabupaten.kabupaten});
            })

            console.log(desaGet)
        })

        .catch(function(error) {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); 
            window.location.href = "index.html";
        });
    }

    function myFunctionEdit(idRuasJalan, kabupatenIdSend, kecamatanIdSend, paths, namaDesa, namaKecamatan, namaKabupaten, namaPerkerasan, namaJenis, namaKondisi, desa_id, kode_ruas, nama_ruas, panjang, lebar, eksisting_id, kondisi_id, jenisjalan_id, keterangan) {

        flag = 2;
        idClicked = idRuasJalan
        console.log(idClicked)
        console.log(`idRuas: ${idRuasJalan}`);
        console.log(`paths: ${paths}`);
        console.log(`namaDesa: ${namaDesa}`);
        console.log(`namaKecamatan: ${namaKecamatan}`);
        console.log(`namaKabupaten: ${namaKabupaten}`);
        console.log(`namaPerkerasan: ${namaPerkerasan}`);
        console.log(`namaJenis: ${namaJenis}`);
        console.log(`namaKondisi: ${namaKondisi}`);
        console.log(`desa_id: ${desa_id}`);
        console.log(`kode_ruas: ${kode_ruas}`);
        console.log(`nama_ruas: ${nama_ruas}`);
        console.log(`panjang: ${panjang}`);
        console.log(`lebar: ${lebar}`);
        console.log(`kondisi_id: ${kondisi_id}`);
        console.log(`eksisting_id: ${eksisting_id}`);
        console.log(`jenisjalan_id: ${jenisjalan_id}`);
        console.log(`keterangan: ${keterangan}`);
        
        document.body.scrollTop = document.documentElement.scrollHeight;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        document.getElementById("checkbox-road-view").style.display = "none";
        selectedKabupatenId = kabupatenIdSend;
        selectedKecamatanId = kecamatanIdSend; 
        selectedDesa = namaDesa;
        selectedKabupaten = namaKabupaten;
        selectedKecamatan = namaKecamatan;
        selectedPerkerasan = namaPerkerasan;
        selectedJenis = namaJenis;
        selectedKondisi = namaKondisi;
        selectedPerkerasanId = eksisting_id;
        selectedJenisId = jenisjalan_id;
        selectedKondisiId = kondisi_id;
        selectedDesaId = desa_id

        document.getElementById("lebar-ruas").value = lebar;
        document.getElementById("kode-ruas").value = kode_ruas;
        document.getElementById("nama-ruas").value = nama_ruas;
        document.getElementById("keterangan-jalan").value = keterangan;
        document.querySelector(".dropbtnkabupaten").textContent = namaKabupaten;
        document.querySelector(".dropbtnkecamatan").textContent = namaKecamatan;
        document.querySelector(".dropbtndesa").textContent = namaDesa;
        document.querySelector(".dropbtnperkerasan").textContent = namaPerkerasan;
        document.querySelector(".dropbtnjenis").textContent = namaJenis;
        document.querySelector(".dropbtnkondisi").textContent = namaKondisi;

        document.getElementById("submit").disabled = false;
        document.getElementById("submit").style.color = ""; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = ""; 

        document.querySelector(".dropbtnkabupaten").disabled = false;
        document.querySelector(".dropbtnkabupaten").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtnkabupaten").style.backgroundColor = ""; 

        document.querySelector(".dropbtnkecamatan").disabled = false;
        document.querySelector(".dropbtnkecamatan").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtnkecamatan").style.backgroundColor = ""; 
        
        document.querySelector(".dropbtndesa").disabled = false;
        document.querySelector(".dropbtndesa").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtndesa").style.backgroundColor = ""; 
        
        document.querySelector(".dropbtnperkerasan").disabled = false;
        document.querySelector(".dropbtnperkerasan").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtnperkerasan").style.backgroundColor = ""; 

        document.querySelector(".dropbtnjenis").disabled = false;
        document.querySelector(".dropbtnjenis").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtnjenis").style.backgroundColor = ""; 

        document.querySelector(".dropbtnkondisi").disabled = false;
        document.querySelector(".dropbtnkondisi").style.color = ""; // Warna teks menjadi abu-abu
        document.querySelector(".dropbtnkondisi").style.backgroundColor = ""; 

        var latlngs = decodePath(paths);
        var savedPolyline = L.polyline(latlngs, {color: '#6374db', weight: 7}).addTo(map);
        map.fitBounds(savedPolyline.getBounds());

        latlngs.forEach(function(latlng) {
            var marker = L.marker(latlng, {draggable: true}).addTo(map);
            marker.on('drag', updatePolyline);
            markers.push(marker);
        });
        
        updatePolyline();

        const apiUrlKabupaten = "https://gisapis.manpits.xyz/api/kabupaten/1";

        const requestOptionsKabupaten = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },            
        };

        fetch(apiUrlKabupaten, requestOptionsKabupaten)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.kabupaten.forEach(function(kabupaten) {
                const existingItem = kabupatenList.find(item => item.id === kabupaten.id);
                
                if (!existingItem) {
                    kabupatenList.push({ id: kabupaten.id, value: kabupaten.value });
                }
            });

            kabupatenList.forEach(function(kabupaten) {
                console.log("ID:", kabupaten.id, "Value:", kabupaten.value);
            });
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });

        kecamatanList = [];
        const apiUrlKecamatan = `https://gisapis.manpits.xyz/api/kecamatan/${selectedKabupatenId}`;

        const requestOptionsKecamatan = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlKecamatan, requestOptionsKecamatan)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.kecamatan.forEach(function(kecamatan) {
                kecamatanList.push({ id: kecamatan.id, value: kecamatan.value });
            });
            
            kecamatanList.forEach(function(kecamatan) {
                console.log("ID:", kecamatan.id, "Value:", kecamatan.value);
            });
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
        
        desaList = [];

        const apiUrlDesa = `https://gisapis.manpits.xyz/api/desa/${selectedKecamatanId}`;

        const requestOptionsDesa = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlDesa, requestOptionsDesa)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.desa.forEach(function(desa) {
                desaList.push({ id: desa.id, value: desa.value });
            });
            
            desaList.forEach(function(desa) {
                console.log("ID:", desa.id, "Value:", desa.value);
            });
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });

        document.querySelector(".overlay-input").style.display = "flex";

        document.getElementById("editButton").addEventListener("click", function(event){
            event.preventDefault();
            document.querySelector(".overlay-input").style.display = "flex";
        });
    }

    function getKabupaten() {
        const apiUrlKabupaten = "https://gisapis.manpits.xyz/api/kabupaten/1";

        const requestOptionsKabupaten = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },            
        };

        fetch(apiUrlKabupaten, requestOptionsKabupaten)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.kabupaten.forEach(function(kabupaten) {
                const existingItem = kabupatenList.find(item => item.id === kabupaten.id);
                
                if (!existingItem) {
                    kabupatenList.push({ id: kabupaten.id, value: kabupaten.value });
                }
            });

            kabupatenList.forEach(function(kabupaten) {
                console.log("ID:", kabupaten.id, "Value:", kabupaten.value);
            });
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    }

    function loadSavedPolylines() {
        
        const apiUrlLoadRuas = "https://gisapis.manpits.xyz/api/ruasjalan";

        const requestOptionsKabupaten = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },            
        };

        fetch(apiUrlLoadRuas, requestOptionsKabupaten)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {    
            console.log('Loaded polylines:', data.ruasjalan);

            // Variabel untuk menyimpan referensi ke polyline dan outline
            var savedPolylineRusak = [];
            var outlineRusak = [];
            var savedPolylineSedang = [];
            var outlineSedang = [];
            var savedPolylineBaik = [];
            var outlineBaik = [];

            data.ruasjalan.forEach(function(ruasJalan) {
                const exists = ruasJalanGet.some(item => item.id === ruasJalan.id);

                if (!exists) {
                    idRuasJalan = ruasJalan.id
                    console.log(`idRuasJalan: ${idRuasJalan}`)
                    console.log(`IdDesa: ${ruasJalan.desa_id}`)
                    perkerasanLoad.forEach(function(perkerasanName){
                        if (perkerasanName.id == ruasJalan.eksisting_id){
                            perkerasanNama = perkerasanName.value;
                        }
                    })

                    kondisiLoad.forEach(function(kondisiName){
                        if (kondisiName.id == ruasJalan.kondisi_id){
                            kondisiNama = kondisiName.value;
                        }
                    })

                    jenisLoad.forEach(function(jenisName){
                        if (jenisName.id == ruasJalan.jenisjalan_id) {
                            jenisNama = jenisName.value
                        }
                    })

                    desaGet.forEach(function(desaGet){
                        if (desaGet.id == ruasJalan.desa_id) {
                            desaKecId = desaGet.kec_id;
                            desaNama = desaGet.desa;
                            console.log(desaNama)
                            kecamatanGet.forEach(function(kecamatanGet){
                                if (kecamatanGet.id == desaKecId) {
                                    kecKabId = kecamatanGet.kab_id;
                                    kecamatanNama = kecamatanGet.kecamatan;
                                    kecamatanIdSend = kecamatanGet.id

                                    kabupatenGet.forEach(function(kabupatenGet){
                                        if (kabupatenGet.id == kecKabId) {
                                            kabupatenNama = kabupatenGet.kabupaten;
                                            kabupatenIdSend = kabupatenGet.id

                                            ruasJalanGetFull.push({
                                                id: ruasJalan.id,
                                                kabRuas_id: kabupatenIdSend,
                                                kecRuas_id: kecamatanIdSend,
                                                desRuas_id: ruasJalan.desa_id,
                                                id_perkerasan: ruasJalan.eksisting_id,
                                                id_kondisi: ruasJalan.kondisi_id,
                                                id_jenis: ruasJalan.jenisjalan_id,
                                                paths: ruasJalan.paths,
                                                desa_id: desaNama,
                                                kecamatan_id: kecamatanNama,
                                                kabupaten_id: kabupatenNama,
                                                kode_ruas: ruasJalan.kode_ruas,
                                                nama_ruas: ruasJalan.nama_ruas,
                                                panjang: ruasJalan.panjang,
                                                lebar: ruasJalan.lebar,
                                                eksisting_id: perkerasanNama,
                                                kondisi_id: kondisiNama,
                                                jenisjalan_id: jenisNama,
                                                keterangan: ruasJalan.keterangan
                                            });

                                            ruasJalanGet.push({
                                                id: ruasJalan.id,
                                                desa_id: desaNama,
                                                kecamatan_id: kecamatanNama,
                                                kabupaten_id: kabupatenNama,
                                                kode_ruas: ruasJalan.kode_ruas,
                                                nama_ruas: ruasJalan.nama_ruas,
                                                panjang: ruasJalan.panjang,
                                                lebar: ruasJalan.lebar,
                                                eksisting_id: perkerasanNama,
                                                kondisi_id: kondisiNama,
                                                jenisjalan_id: jenisNama,
                                                keterangan: ruasJalan.keterangan
                                            });
                                        } 
                                    });
                                }
                            });
                        }
                    });                    
                }

                // Menambahkan event listener untuk perubahan status checked
                checkboxJalanRusak.addEventListener('change', function() {
                    if (checkboxJalanRusak.checked) {
                        console.log('Checkbox jalan_rusak dicentang');
                        perkerasanLoad.forEach(function(perkerasanName){
                            if (perkerasanName.id == ruasJalan.eksisting_id){
                                perkerasanNama = perkerasanName.value;
                            }
                        })
    
                        kondisiLoad.forEach(function(kondisiName){
                            if (kondisiName.id == ruasJalan.kondisi_id){
                                kondisiNama = kondisiName.value;
                            }
                        })
    
                        jenisLoad.forEach(function(jenisName){
                            if (jenisName.id == ruasJalan.jenisjalan_id) {
                                jenisNama = jenisName.value
                            }
                        })
                        desaGet.forEach(function(desaGet){
                            if (desaGet.id == ruasJalan.desa_id) {
                                desaKecId = desaGet.kec_id;
                                desaNama = desaGet.desa;
                                console.log(desaNama)
                                kecamatanGet.forEach(function(kecamatanGet){
                                    if (kecamatanGet.id == desaKecId) {
                                        kecKabId = kecamatanGet.kab_id;
                                        kecamatanNama = kecamatanGet.kecamatan;
                                        kecamatanIdSend = kecamatanGet.id

                                        kabupatenGet.forEach(function(kabupatenGet){
                                            if (kabupatenGet.id == kecKabId) {
                                                kabupatenNama = kabupatenGet.kabupaten;
                                                kabupatenIdSend = kabupatenGet.id
                                            } 
                                        });
                                    }
                                });
                            }
                        });      

                        if (ruasJalan.kondisi_id == 3) {
                            var latlngs = decodePath(ruasJalan.paths);
                            var outline = L.polyline(latlngs, {
                                color: '#7f1f1f', // Warna outline
                                weight: 7,       // Lebar outline lebih besar dari polyline utama
                                opacity: 1        // Opacity full untuk outline
                            }).addTo(map);
                            outlineRusak.push(outline);

                            var polyline = L.polyline(latlngs, {color: '#f60002', weight: 3}).addTo(map);
                            savedPolylineRusak.push(polyline);

                            console.log(ruasJalan.id)
                            polyline.bindTooltip(ruasJalan.kode_ruas, {permanent: true, direction: 'center', className: 'my-tooltip'}).openTooltip();
                            polyline.bindPopup(`Nama Desa: ${desaNama}<br>Nama Kecamatan: ${kecamatanNama}<br>Nama Kabupaten: ${kabupatenNama}<br>Nama Ruas: ${ruasJalan.nama_ruas}<br>Panjang: ${ruasJalan.panjang} meter<br>Lebar: ${ruasJalan.lebar} meter<br>Keterangan: ${ruasJalan.keterangan}<br><br><button id="editButton" onclick="myFunctionEdit(
                                '${ruasJalan.id}',
                                '${kabupatenIdSend}',
                                '${kecamatanIdSend}',
                                '${ruasJalan.paths.replace(/\\/g, '\\\\')}',
                                '${desaNama}',
                                '${kecamatanNama}',
                                '${kabupatenNama}',
                                '${perkerasanNama}',
                                '${jenisNama}',
                                '${kondisiNama}',
                                '${ruasJalan.desa_id}',
                                '${ruasJalan.kode_ruas}',
                                '${ruasJalan.nama_ruas}',
                                '${ruasJalan.panjang}',
                                '${ruasJalan.lebar}',
                                '${ruasJalan.eksisting_id}',
                                '${ruasJalan.kondisi_id}',
                                '${ruasJalan.jenisjalan_id}',
                                '${ruasJalan.keterangan.replace(/'/g, "\\'")}'
                            )">Edit</button><br><button id="deleteButton" onclick="myFunctionDelete(${ruasJalan.id})">Delete</button>`);
                        }

                    } else {
                        // Hapus polyline dan outline jika checkbox tidak dicentang
                        outlineRusak.forEach(layer => map.removeLayer(layer));
                        savedPolylineRusak.forEach(layer => map.removeLayer(layer));
                        outlineRusak = [];
                        savedPolylineRusak = [];
                    }
                });

                checkboxJalanSedang.addEventListener('change', function() {
                    if (checkboxJalanSedang.checked) {
                        console.log('Checkbox jalan_sedang dicentang');
                        perkerasanLoad.forEach(function(perkerasanName){
                            if (perkerasanName.id == ruasJalan.eksisting_id){
                                perkerasanNama = perkerasanName.value;
                            }
                        })
    
                        kondisiLoad.forEach(function(kondisiName){
                            if (kondisiName.id == ruasJalan.kondisi_id){
                                kondisiNama = kondisiName.value;
                            }
                        })
    
                        jenisLoad.forEach(function(jenisName){
                            if (jenisName.id == ruasJalan.jenisjalan_id) {
                                jenisNama = jenisName.value
                            }
                        })
                        desaGet.forEach(function(desaGet){
                            if (desaGet.id == ruasJalan.desa_id) {
                                desaKecId = desaGet.kec_id;
                                desaNama = desaGet.desa;
                                console.log(desaNama)
                                kecamatanGet.forEach(function(kecamatanGet){
                                    if (kecamatanGet.id == desaKecId) {
                                        kecKabId = kecamatanGet.kab_id;
                                        kecamatanNama = kecamatanGet.kecamatan;
                                        kecamatanIdSend = kecamatanGet.id

                                        kabupatenGet.forEach(function(kabupatenGet){
                                            if (kabupatenGet.id == kecKabId) {
                                                kabupatenNama = kabupatenGet.kabupaten;
                                                kabupatenIdSend = kabupatenGet.id
                                            } 
                                        });
                                    }
                                });
                            }
                        });      

                        if (ruasJalan.kondisi_id == 2) {
                            var latlngsSedang = decodePath(ruasJalan.paths);
                            var outline = L.polyline(latlngsSedang, {
                                color: '#f09e17', // Warna outline
                                weight: 7,       // Lebar outline lebih besar dari polyline utama
                                opacity: 1        // Opacity full untuk outline
                            }).addTo(map);
                            outlineSedang.push(outline);

                            var polyline = L.polyline(latlngsSedang, {color: '#ffff08', weight: 3}).addTo(map);
                            savedPolylineSedang.push(polyline);
                            
                            console.log(ruasJalan.id)
                            polyline.bindTooltip(ruasJalan.kode_ruas, {permanent: true, direction: 'center', className: 'my-tooltip'}).openTooltip();
                            polyline.bindPopup(`Nama Desa: ${desaNama}<br>Nama Kecamatan: ${kecamatanNama}<br>Nama Kabupaten: ${kabupatenNama}<br>Nama Ruas: ${ruasJalan.nama_ruas}<br>Panjang: ${ruasJalan.panjang} meter<br>Lebar: ${ruasJalan.lebar} meter<br>Keterangan: ${ruasJalan.keterangan}<br><br><button id="editButton" onclick="myFunctionEdit(
                                '${ruasJalan.id}',
                                '${kabupatenIdSend}',
                                '${kecamatanIdSend}',
                                '${ruasJalan.paths.replace(/\\/g, '\\\\')}',
                                '${desaNama}',
                                '${kecamatanNama}',
                                '${kabupatenNama}',
                                '${perkerasanNama}',
                                '${jenisNama}',
                                '${kondisiNama}',
                                '${ruasJalan.desa_id}',
                                '${ruasJalan.kode_ruas}',
                                '${ruasJalan.nama_ruas}',
                                '${ruasJalan.panjang}',
                                '${ruasJalan.lebar}',
                                '${ruasJalan.eksisting_id}',
                                '${ruasJalan.kondisi_id}',
                                '${ruasJalan.jenisjalan_id}',
                                '${ruasJalan.keterangan.replace(/'/g, "\\'")}'
                            )">Edit</button><br><button id="deleteButton" onclick="myFunctionDelete(${ruasJalan.id})">Delete</button>`);
                        }

                    } else {
                        // Hapus polyline dan outline jika checkbox tidak dicentang
                        outlineSedang.forEach(layer => map.removeLayer(layer));
                        savedPolylineSedang.forEach(layer => map.removeLayer(layer));
                        outlineSedang = [];
                        savedPolylineSedang = [];
                    }
                });

                checkboxJalanBaik.addEventListener('change', function() {
                    if (checkboxJalanBaik.checked) {
                        console.log('Checkbox jalan_baik dicentang');
                        perkerasanLoad.forEach(function(perkerasanName){
                            if (perkerasanName.id == ruasJalan.eksisting_id){
                                perkerasanNama = perkerasanName.value;
                            }
                        })
    
                        kondisiLoad.forEach(function(kondisiName){
                            if (kondisiName.id == ruasJalan.kondisi_id){
                                kondisiNama = kondisiName.value;
                            }
                        })
    
                        jenisLoad.forEach(function(jenisName){
                            if (jenisName.id == ruasJalan.jenisjalan_id) {
                                jenisNama = jenisName.value
                            }
                        })
                        desaGet.forEach(function(desaGet){
                            if (desaGet.id == ruasJalan.desa_id) {
                                desaKecId = desaGet.kec_id;
                                desaNama = desaGet.desa;
                                console.log(desaNama)
                                kecamatanGet.forEach(function(kecamatanGet){
                                    if (kecamatanGet.id == desaKecId) {
                                        kecKabId = kecamatanGet.kab_id;
                                        kecamatanNama = kecamatanGet.kecamatan;
                                        kecamatanIdSend = kecamatanGet.id

                                        kabupatenGet.forEach(function(kabupatenGet){
                                            if (kabupatenGet.id == kecKabId) {
                                                kabupatenNama = kabupatenGet.kabupaten;
                                                kabupatenIdSend = kabupatenGet.id
                                            } 
                                        });
                                    }
                                });
                            }
                        });      

                        if (ruasJalan.kondisi_id == 1) {
                            var latlngsBaik = decodePath(ruasJalan.paths);
                            var outline = L.polyline(latlngsBaik, {
                                color: '#126208', // Warna outline
                                weight: 7,       // Lebar outline lebih besar dari polyline utama
                                opacity: 1        // Opacity full untuk outline
                            }).addTo(map);
                            outlineBaik.push(outline);

                            var polyline = L.polyline(latlngsBaik, {color: '#02b949', weight: 3}).addTo(map);
                            savedPolylineBaik.push(polyline);
                            
                            console.log(ruasJalan.id)
                            polyline.bindTooltip(ruasJalan.kode_ruas, {permanent: true, direction: 'center', className: 'my-tooltip'}).openTooltip();
                            polyline.bindPopup(`Nama Desa: ${desaNama}<br>Nama Kecamatan: ${kecamatanNama}<br>Nama Kabupaten: ${kabupatenNama}<br>Nama Ruas: ${ruasJalan.nama_ruas}<br>Panjang: ${ruasJalan.panjang} meter<br>Lebar: ${ruasJalan.lebar} meter<br>Keterangan: ${ruasJalan.keterangan}<br><br><button id="editButton" onclick="myFunctionEdit(
                                '${ruasJalan.id}',
                                '${kabupatenIdSend}',
                                '${kecamatanIdSend}',
                                '${ruasJalan.paths.replace(/\\/g, '\\\\')}',
                                '${desaNama}',
                                '${kecamatanNama}',
                                '${kabupatenNama}',
                                '${perkerasanNama}',
                                '${jenisNama}',
                                '${kondisiNama}',
                                '${ruasJalan.desa_id}',
                                '${ruasJalan.kode_ruas}',
                                '${ruasJalan.nama_ruas}',
                                '${ruasJalan.panjang}',
                                '${ruasJalan.lebar}',
                                '${ruasJalan.eksisting_id}',
                                '${ruasJalan.kondisi_id}',
                                '${ruasJalan.jenisjalan_id}',
                                '${ruasJalan.keterangan.replace(/'/g, "\\'")}'
                            )">Edit</button><br><button id="deleteButton" onclick="myFunctionDelete(${ruasJalan.id})">Delete</button>`);
                        }

                    } else {
                        // Hapus polyline dan outline jika checkbox tidak dicentang
                        outlineBaik.forEach(layer => map.removeLayer(layer));
                        savedPolylineBaik.forEach(layer => map.removeLayer(layer));
                        outlineBaik = [];
                        savedPolylineBaik = [];
                    }
                });
            });
        })
        .catch(function(error) {
            console.error('Error loading saved polylines:', error);
        });
    }

    document.getElementById('green').style.backgroundColor = '#02b949';
    document.getElementById('yellow').style.backgroundColor = '#f7d800';
    document.getElementById('red').style.backgroundColor = '#f60002';

    document.getElementById("delete-marker").addEventListener("click", function(){
        if (markers.length === 0){
            return;
        }

        if (markers.length === 1){
            document.getElementById('polylineMenu').style.visibility = "hidden";
        }
        
        if (inputMode == 'belakang') {
            // Hapus marker terakhir dari peta dan dari array
            var lastMarker = markers.pop();
            map.removeLayer(lastMarker);
        } else {
            var frontMarker = markers.shift();
            map.removeLayer(frontMarker);
        }

        
        updatePolyline();
    });
    
    function showConfirmation() {
        var result = confirm("Do you want to proceed?");
        
        if (result) {
            flagDelete = "yes"
        } else {
            flagDelete = "no"
        }
    }

    function myFunctionDelete(idData) {
        event.preventDefault();
        // Call the function to show the confirmation dialog

        showConfirmation();

        if (flagDelete == "yes") {
            const apiUrlDeleteRuas = `https://gisapis.manpits.xyz/api/ruasjalan/${idData}`;

            const requestOptionsDelete = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },            
            };
    
            fetch(apiUrlDeleteRuas, requestOptionsDelete)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete!'); // Memberikan pesan kesalahan yang lebih umum
                }
                return response.json();
            })
            .then(data => {    
                alert(data.status)
                localStorage.setItem("flagDelete", flagDelete)
                window.location.href = "mapview.html"
            })
            .catch(function(error) {
                console.error('Error deleting:', error);
            });
        }
    }
    
    var tanahCount = 0;
    var tanahBetonCount = 0;
    var perkerasanBahanCount = 0;
    var koralCount = 0;
    var lapenCount = 0;
    var pavingCount = 0;
    var hotmixCount = 0;
    var betonCount = 0;
    var betonLapenCount = 0;

    document.getElementById("lihat-ruas").addEventListener("click", function(event){
        event.preventDefault();
        console.log(ruasJalanGet)
        populateTable(ruasJalanGet, ruasJalanGetFull);
        document.getElementById("table-overlay").style.display = "block";
        document.getElementById("checkbox-road-view").style.display = "none";

        const tanahFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 1;
        });

        const tanahBetonFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 2;
        });
        
        const perkerasanBahanFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 3;
        });
        
        const koralFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 4;
        });
        
        const lapenFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 5;
        });
        
        const pavingFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 6;
        });

        const hotmixFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 7;
        });

        const betonFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 8;
        });

        const betonLapenFilter = ruasJalanGetFull.filter(function(data) {
            return data.id_perkerasan == 9;
        });

        tanahCount = tanahFilter.length;
        tanahBetonCount = tanahBetonFilter.length;
        perkerasanBahanCount = perkerasanBahanFilter.length;
        koralCount = koralFilter.length;
        lapenCount = lapenFilter.length;
        pavingCount = pavingFilter.length;
        hotmixCount = hotmixFilter.length;
        betonCount = betonFilter.length;
        betonLapenCount = betonLapenFilter.length;

        document.getElementById("tanah").textContent += `${tanahCount}`;
        document.getElementById("tanah-beton").textContent += `${tanahBetonCount}`;
        document.getElementById("perkerasanbahan").textContent += `${perkerasanBahanCount}`;
        document.getElementById("koral").textContent += `${koralCount}`;
        document.getElementById("lapen").textContent += `${lapenCount}`;
        document.getElementById("paving").textContent += `${pavingCount}`;
        document.getElementById("hotmix").textContent += `${hotmixCount}`;
        document.getElementById("beton").textContent += `${betonCount}`;
        document.getElementById("beton-lapen").textContent += `${betonLapenCount}`;

    });

    document.getElementById('myInputByRuas').addEventListener("input", function(event) {
        event.preventDefault();

        const query = event.target.value.toLowerCase().trim();

        const queryWords = query.split(' ');
    
        const filteredData = ruasJalanGet.filter(item => {
            const itemString = Object.values(item).join(' ').toLowerCase();
            return queryWords.every(word => itemString.includes(word));
        });
        
        populateTable(filteredData, ruasJalanGetFull);
    });
    
    const selectedConditions = [];

    // Fungsi untuk memperbarui tabel berdasarkan kondisi yang dipilih
    function updateTable() {
        const filteredData = ruasJalanGet.filter(item => {
            // Jika tidak ada kondisi yang dipilih, tampilkan semua data
            if (selectedConditions.length === 0) return true;
            // Periksa apakah kondisi jalan ada dalam kondisi yang dipilih
            return selectedConditions.includes(item.kondisi_id.toLowerCase());
        });
        populateTable(filteredData, ruasJalanGetFull);
    }
    
    // Fungsi untuk menangani perubahan checkbox
    function handleCheckboxChange(event) {
        const condition = event.target.value.toLowerCase();
        const isChecked = event.target.checked;
        if (isChecked) {
            // Tambahkan kondisi ke array jika checkbox dicentang
            selectedConditions.push(condition);
        } else {
            // Hapus kondisi dari array jika checkbox tidak dicentang
            const index = selectedConditions.indexOf(condition);
            if (index > -1) {
                selectedConditions.splice(index, 1);
            }
        }
        updateTable();
    }
    
    // Tambahkan event listener ke setiap checkbox
    document.getElementById('conditionBaik').addEventListener('change', handleCheckboxChange);
    document.getElementById('conditionSedang').addEventListener('change', handleCheckboxChange);
    document.getElementById('conditionRusak').addEventListener('change', handleCheckboxChange);
    
    var baikCount = 0;
    var sedangCount = 0;
    var rusakCount = 0;

    // Fungsi untuk mengisi tabel
    function populateTable(data, dataFull) {
        const tableBody = document.getElementById('data-table-body');
        
        const baikFilter = dataFull.filter(function(data) {
            return data.id_kondisi == 1;
        });

        const sedangFilter = dataFull.filter(function(data) {
            return data.id_kondisi == 2;
        });

        const rusakFilter = dataFull.filter(function(data) {
            return data.id_kondisi == 3;
        });

    
        baikCount = baikFilter.length;
        sedangCount = sedangFilter.length;
        rusakCount = rusakFilter.length;

        document.getElementById("jumlah-baik").textContent = baikCount; 
        document.getElementById("jumlah-sedang").textContent = sedangCount;
        document.getElementById("jumlah-rusak").textContent = rusakCount;

        
        tableBody.innerHTML = '';
        const uniqueArray = data.filter((item, index) => data.indexOf(item) === index);
        uniqueArray.forEach(item => {
            const row = document.createElement('tr');
            
            Object.values(item).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
    
            const buttonCell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = 'Edit'; // Teks pada tombol
            button.setAttribute('data-id', item.id); // Mengatur data-id pada tombol
            
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                console.log('Button clicked for item with ID:', id);
                document.getElementById("table-overlay").style.display = "none";
                document.getElementById("checkbox-road-view").style.display = "block";
                document.getElementById("tanah").textContent = "Tanah: ";
                document.getElementById("tanah-beton").textContent = "Tanah/Beton: ";
                document.getElementById("perkerasanbahan").textContent = "Perkerasan: ";
                document.getElementById("koral").textContent = "Koral: ";
                document.getElementById("lapen").textContent = "Lapen: ";
                document.getElementById("paving").textContent = "Paving: ";
                document.getElementById("hotmix").textContent = "Hotmix: ";
                document.getElementById("beton").textContent = "Beton: ";
                document.getElementById("beton-lapen").textContent = "Beton/Lapen: ";
                dataFull.forEach(function(ruasJalanData) {
                    if (id == ruasJalanData.id) {
                        document.getElementById("table-overlay").style.display = "none";
                        myFunctionEdit(
                            ruasJalanData.id, 
                            ruasJalanData.kabRuas_id, 
                            ruasJalanData.kecRuas_id,
                            ruasJalanData.paths,
                            ruasJalanData.desa_id,
                            ruasJalanData.kecamatan_id,
                            ruasJalanData.kabupaten_id,
                            ruasJalanData.eksisting_id,
                            ruasJalanData.jenisjalan_id,
                            ruasJalanData.kondisi_id,
                            ruasJalanData.desRuas_id,
                            ruasJalanData.kode_ruas,
                            ruasJalanData.nama_ruas,
                            ruasJalanData.panjang,
                            ruasJalanData.lebar,
                            ruasJalanData.id_perkerasan,
                            ruasJalanData.id_kondisi,
                            ruasJalanData.id_jenis,
                            ruasJalanData.keterangan
                        );
                    }
                });
            });
    
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Delete'; // Teks pada tombol
            buttonDelete.style.backgroundColor = 'red';
            buttonDelete.setAttribute('data-id', item.id); // Mengatur data-id pada tombol
            
            buttonDelete.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                console.log('Button clicked for item with ID:', id);
    
                myFunctionDelete(id);

            });
    
            const buttonView = document.createElement('button');
            buttonView.textContent = 'Lihat'; // Teks pada tombol
            buttonView.style.backgroundColor = '#22ba02';
            buttonView.setAttribute('data-id', item.id); // Mengatur data-id pada tombol
            
            buttonView.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                document.getElementById("checkbox-road-view").style.display = "block";
                console.log('Button clicked for item with ID:', id);
                document.getElementById("table-overlay").style.display = "none";
                document.getElementById("checkbox-road-view").style.display = "block";
                document.getElementById("tanah").textContent = "Tanah: ";
                document.getElementById("tanah-beton").textContent = "Tanah/Beton: ";
                document.getElementById("perkerasanbahan").textContent = "Perkerasan: ";
                document.getElementById("koral").textContent = "Koral: ";
                document.getElementById("lapen").textContent = "Lapen: ";
                document.getElementById("paving").textContent = "Paving: ";
                document.getElementById("hotmix").textContent = "Hotmix: ";
                document.getElementById("beton").textContent = "Beton: ";
                document.getElementById("beton-lapen").textContent = "Beton/Lapen: ";
                dataFull.forEach(function(ruasJalanData) {
                    if (id == ruasJalanData.id) {
                        checkboxJalanRusak.checked = true;
                        checkboxJalanBaik.checked = true;
                        checkboxJalanSedang.checked = true;
                    
                        checkboxJalanRusak.dispatchEvent(new Event('change'));
                        checkboxJalanBaik.dispatchEvent(new Event('change'));
                        checkboxJalanSedang.dispatchEvent(new Event('change'));
                        document.getElementById('conditionBaik').checked = false;
                        document.getElementById('conditionSedang').checked = false;
                        document.getElementById('conditionRusak').checked = false;
                        document.getElementById("table-overlay").style.display = "none";
                        var latlngs = decodePath(ruasJalanData.paths);
            
                        var bounds = L.latLngBounds(latlngs);
                        map.fitBounds(bounds);
                    }
                });
            });
    
            // Menambahkan tombol ke dalam sel
            buttonCell.appendChild(buttonView);
            buttonCell.appendChild(button);
            buttonCell.appendChild(buttonDelete);
    
            // Menambahkan sel tombol ke dalam baris
            row.appendChild(buttonCell);
    
            // Menambahkan baris ke tabel
            tableBody.appendChild(row);
        });        
    }    

    document.getElementById("close-overlay").addEventListener("click", function(event){
        event.preventDefault();

        document.getElementById("table-overlay").style.display = "none";
        document.getElementById("checkbox-road-view").style.display = "block";
        document.getElementById("tanah").textContent = "Tanah: ";
        document.getElementById("tanah-beton").textContent = "Tanah/Beton: ";
        document.getElementById("perkerasanbahan").textContent = "Perkerasan: ";
        document.getElementById("koral").textContent = "Koral: ";
        document.getElementById("lapen").textContent = "Lapen: ";
        document.getElementById("paving").textContent = "Paving: ";
        document.getElementById("hotmix").textContent = "Hotmix: ";
        document.getElementById("beton").textContent = "Beton: ";
        document.getElementById("beton-lapen").textContent = "Beton/Lapen: ";
        checkboxJalanRusak.checked = true;
        checkboxJalanBaik.checked = true;
        checkboxJalanSedang.checked = true;
        document.getElementById('conditionBaik').checked = false;
        document.getElementById('conditionSedang').checked = false;
        document.getElementById('conditionRusak').checked = false;
        
        checkboxJalanRusak.dispatchEvent(new Event('change'));
        checkboxJalanBaik.dispatchEvent(new Event('change'));
        checkboxJalanSedang.dispatchEvent(new Event('change'));
    })

    const apiUrl = "https://gisapis.manpits.xyz/api/logout";
    
    console.log(`token ${token}`)

    document.getElementById("logout").addEventListener("click", function() {
        event.preventDefault()
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },            
        };

        fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            alert(`${data.meta.message}`); // Menampilkan pesan sukses atau pesan kesalahan
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    });

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", mobileMenu);

    function mobileMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    }

    document.getElementById("upload").addEventListener("click", function(event) {    
        event.preventDefault()
        flag = 1;
        document.getElementById("checkbox-road-view").style.display = "none";
        document.getElementById("hapus-marker").style.display = "none";
        document.body.scrollTop = document.documentElement.scrollHeight;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        const apiUrlKabupaten = "https://gisapis.manpits.xyz/api/kabupaten/1";

        const requestOptionsKabupaten = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },            
        };

        fetch(apiUrlKabupaten, requestOptionsKabupaten)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.kabupaten.forEach(function(kabupaten) {
                const existingItem = kabupatenList.find(item => item.id === kabupaten.id);
                
                if (!existingItem) {
                    kabupatenList.push({ id: kabupaten.id, value: kabupaten.value });
                }
            });

            kabupatenList.forEach(function(kabupaten) {
                console.log("ID:", kabupaten.id, "Value:", kabupaten.value);
            });
        })
        .catch(error => {
            alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
        
        document.querySelector(".overlay-input").style.display = "flex"; // Menampilkan formulir saat tombol diklik
    });

    document.getElementById("register").addEventListener("click", function(event){
        event.preventDefault()
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        hideOverlay();
        document.getElementById("checkbox-road-view").style.display = "block";
        window.location.href = "mapview.html"
    });
    
    function hideOverlay() {
        document.getElementById("submit").disabled = true
        document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = "lightgray"; 

        const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
        dropdownPerkerasan.classList.remove("showPerkerasan");

        const dropdownJenis = document.getElementById("myDropdownJenis");
        dropdownJenis.classList.remove("showJenis");

        const dropdownKondisi = document.getElementById("myDropdownKondisi");
        dropdownKondisi.classList.remove("showKondisi");

        document.querySelector(".dropbtnkabupaten").textContent = "Pilih Kabupaten";
        selectedKabupaten = "";
        selectedKecamatan = "";
        selectedDesa = "";

        kecamatanList = [];
        kabupatenList = [];
        desaList = [];

        selectedDesaId = 0;
        selectedKecamatanId = 0;
        selectedKabupatenId = 0;
        selectedPerkerasanId = 0;
        selectedKondisiId = 0;
        selectedJenisId = 0;
        
        document.getElementById("lebar-ruas").value = "";
        document.getElementById("kode-ruas").value = "";
        document.getElementById("nama-ruas").value = "";
        document.getElementById("keterangan-jalan").value = "";
        document.querySelector(".dropbtnkecamatan").textContent = "Pilih Kecamatan";
        document.querySelector(".dropbtndesa").textContent = "Pilih Desa";
        document.querySelector(".dropbtnperkerasan").textContent = "Pilih Perkerasan";
        document.querySelector(".dropbtnjenis").textContent = "Pilih Jenis Jalan";
        document.querySelector(".dropbtnkondisi").textContent = "Pilih Kondisi Jalan";

        const buttonKecamatan = document.querySelector(".dropbtnkecamatan");
        buttonKecamatan.disabled = true;
        buttonKecamatan.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonKecamatan.style.backgroundColor = "lightgray"; 


        const buttonDesa = document.querySelector(".dropbtndesa");
        buttonDesa.disabled = true;
        buttonDesa.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonDesa.style.backgroundColor = "lightgray"; 
        document.querySelector(".overlay-input").style.display = "none";
    }

    if (selectedKabupaten == "" || selectedKabupaten == "Pilih Kabupaten") {
        const buttonKecamatan = document.querySelector(".dropbtnkecamatan");
        buttonKecamatan.disabled = true;
        buttonKecamatan.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonKecamatan.style.backgroundColor = "lightgray"; 
    } else {
        const buttonKecamatan = document.querySelector(".dropbtnkecamatan");
        buttonKecamatan.disabled = false;
        buttonKecamatan.style.color = "";
        buttonKecamatan.style.backgroundColor = "";
    }

    if (selectedKabupaten == "" || selectedKecamatan == "" || selectedKabupaten == "Pilih Kabupaten" && selectedKecamatan == "Pilih Kecamatan") {
        const buttonDesa = document.querySelector(".dropbtndesa");
        buttonDesa.disabled = true;
        buttonDesa.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonDesa.style.backgroundColor = "lightgray"; 
    } else {
        const buttonDesa = document.querySelector(".dropbtndesa");
        buttonDesa.disabled = false;
        buttonDesa.style.color = "";
        buttonDesa.style.backgroundColor = "";

        const apiUrlKecamatan = `https://gisapis.manpits.xyz/api/kecamatan/${selectedKabupatenId}`;

        event.preventDefault()
        const requestOptionsKecamatan = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },            
        };

        fetch(apiUrlKecamatan, requestOptionsKecamatan)
        .then(response => {
            if (!response.ok) {
                throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
            }
            return response.json();
        })
        .then(data => {
            // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
            
            data.kecamatan.forEach(function(kecamatan) {
                const existingItem = kecamatanList.find(item => item.id === kecamatan.id);
                
                if (!existingItem) {
                    kecamatanList.push({ id: kecamatan.id, value: kecamatan.value });
                }
            });

            kecamatanList.forEach(function(kecamatan) {
                console.log("ID:", kecamatan.id, "Value:", kecamatan.value);
            });
        })
        .catch(error => {
            // alert(`Your session is Expired!`);
            localStorage.removeItem('token'); // Menghapus token dari localStorage
            window.location.href = "index.html";
        });
    }

    function myFunctionKabuputen() {
        event.preventDefault()
        document.getElementById("myDropdownKabupaten").classList.toggle("showKabupaten");
        const dropdown = document.getElementById("myDropdownKabupaten");
        
        document.getElementById("submit").disabled = true
        document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = "lightgray"; 

        const buttonKecamatan = document.querySelector(".dropbtnkecamatan");
        buttonKecamatan.disabled = true;
        buttonKecamatan.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonKecamatan.style.backgroundColor = "lightgray"; 
        const dropdownKecamatan = document.getElementById("myDropdownKecamatan");
        dropdownKecamatan.classList.remove("showKecamatan");
        buttonKecamatan.textContent = "Pilih Kecamatan";
        selectedKecamatanId = 0;

        const buttonDesa = document.querySelector(".dropbtndesa");
        buttonDesa.disabled = true;
        buttonDesa.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonDesa.style.backgroundColor = "lightgray"; 
        const dropdownDesa = document.getElementById("myDropdownDesa");
        dropdownDesa.classList.remove("showDesa");
        buttonDesa.textContent = "Pilih Desa";
        selectedDesaId = 0;

        const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
        dropdownPerkerasan.classList.remove("showPerkerasan");

        const dropdownJenis = document.getElementById("myDropdownJenis");
        dropdownJenis.classList.remove("showJenis");

        const dropdownKondisi = document.getElementById("myDropdownKondisi");
        dropdownKondisi.classList.remove("showKondisi");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });

        // Loop melalui data dari API dan buat opsi dropdown
        kabupatenList.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            // Masukkan opsi dropdown ke dalam dropdown list
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)
                
                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedKabupaten = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtnkabupaten");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedKabupaten;
                selectedKabupatenId = item.id;

                const buttonKecamatan = document.querySelector(".dropbtnkecamatan");
                buttonKecamatan.disabled = false;
                buttonKecamatan.style.color = "";
                buttonKecamatan.style.backgroundColor = "";
                dropdown.classList.remove("showKabupaten");
                const dropdownKecamatan = document.getElementById("myDropdownKecamatan");
                
                const buttonKecamatanValue = document.querySelector(".dropbtnkecamatan");
                buttonKecamatanValue.textContent = "Pilih Kecamatan";
                
                selectedKecamatanId = 0;
                const buttonDesa = document.querySelector(".dropbtndesa");
                buttonDesa.disabled = false;
                buttonDesa.style.color = "gray"; // Warna teks menjadi abu-abu
                buttonDesa.style.backgroundColor = "lightgray"; 
                
                // Menghapus semua elemen <a> dari inner HTML
                dropdownKecamatan.querySelectorAll("a").forEach(function(element) {
                    element.remove();
                });

                kecamatanList = [];
                const apiUrlKecamatan = `https://gisapis.manpits.xyz/api/kecamatan/${selectedKabupatenId}`;

                const requestOptionsKecamatan = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },            
                };

                fetch(apiUrlKecamatan, requestOptionsKecamatan)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
                    }
                    return response.json();
                })
                .then(data => {
                    // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
                    
                    data.kecamatan.forEach(function(kecamatan) {
                        kecamatanList.push({ id: kecamatan.id, value: kecamatan.value });
                    });
                    
                    kecamatanList.forEach(function(kecamatan) {
                        console.log("ID:", kecamatan.id, "Value:", kecamatan.value);
                    });
                })
                .catch(error => {
                    alert(`Your session is Expired!`);
                    localStorage.removeItem('token'); // Menghapus token dari localStorage
                    window.location.href = "index.html";
                });
            });
            // Masukkan opsi dropdown ke dalam dropdown list
            dropdown.appendChild(option);
        });
    }

    function filterFunctionKabupaten() {
        const input = document.getElementById("myInputKabupaten");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownKabupaten");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    function myFunctionKecamatan() {
        event.preventDefault()
        document.getElementById("submit").disabled = true
        document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = "lightgray"; 

        const buttonDesa = document.querySelector(".dropbtndesa");
        buttonDesa.disabled = true;
        buttonDesa.style.color = "gray"; // Warna teks menjadi abu-abu
        buttonDesa.style.backgroundColor = "lightgray"; 
        const dropdownDesa = document.getElementById("myDropdownDesa");
        dropdownDesa.classList.remove("showDesa");
        buttonDesa.textContent = "Pilih Desa";
        selectedDesaId = 0;

        const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
        dropdownPerkerasan.classList.remove("showPerkerasan");

        const dropdownJenis = document.getElementById("myDropdownJenis");
        dropdownJenis.classList.remove("showJenis");

        const dropdownKondisi = document.getElementById("myDropdownKondisi");
        dropdownKondisi.classList.remove("showKondisi");

        document.getElementById("myDropdownKecamatan").classList.toggle("showKecamatan");
        const dropdown = document.getElementById("myDropdownKecamatan");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });

        // Loop melalui data dari API dan buat opsi dropdown
        kecamatanList.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            // Masukkan opsi dropdown ke dalam dropdown list
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)

                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedKecamatanId = item.id;
                selectedKecamatan = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtnkecamatan");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedKecamatan;

                dropdown.classList.remove("showKecamatan");

                desaList = [];
                const buttonDesa = document.querySelector(".dropbtndesa");
                buttonDesa.disabled = false;
                buttonDesa.style.color = "";
                buttonDesa.style.backgroundColor = "";

                const apiUrlDesa = `https://gisapis.manpits.xyz/api/desa/${selectedKecamatanId}`;

                const requestOptionsDesa = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },            
                };

                fetch(apiUrlDesa, requestOptionsDesa)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Please try again.'); // Memberikan pesan kesalahan yang lebih umum
                    }
                    return response.json();
                })
                .then(data => {
                    // alert(`${data.status}`); // Menampilkan pesan sukses atau pesan kesalahan
                    
                    data.desa.forEach(function(desa) {
                        desaList.push({ id: desa.id, value: desa.value });
                    });
                    
                    desaList.forEach(function(desa) {
                        console.log("ID:", desa.id, "Value:", desa.value);
                    });
                })
                .catch(error => {
                    alert(`Your session is Expired!`);
                    localStorage.removeItem('token'); // Menghapus token dari localStorage
                    window.location.href = "index.html";
                });
            });
            // Masukkan opsi dropdown ke dalam dropdown list
            dropdown.appendChild(option);
        });
    }
    
    function filterFunctionKecamatan() {
        const input = document.getElementById("myInputKecamatan");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownKecamatan");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    if (selectedDesaId == 0) {
        const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
        dropdownPerkerasan.classList.remove("showPerkerasan");

        const dropdownJenis = document.getElementById("myDropdownJenis");
        dropdownJenis.classList.remove("showJenis");

        const dropdownKondisi = document.getElementById("myDropdownKondisi");
        dropdownKondisi.classList.remove("showKondisi");
    }

    function myFunctionDesa() {
        event.preventDefault()

        document.getElementById("submit").disabled = true
        document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = "lightgray"; 

        document.getElementById("myDropdownDesa").classList.toggle("showDesa");
        document.getElementById("myDropdownPerkerasan").classList.remove("showPerkerasan");
        document.getElementById("myDropdownJenis").classList.remove("showJenis");
        document.getElementById("myDropdownKondisi").classList.remove("showKondisi");
        const dropdown = document.getElementById("myDropdownDesa");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });
        
        // Loop melalui data dari API dan buat opsi dropdown
        desaList.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            // Masukkan opsi dropdown ke dalam dropdown list
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)
                
                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedDesa = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtndesa");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedDesa;
                selectedDesaId = item.id;

                if (selectedPerkerasanId, selectedJenisId, selectedKondisiId == 0) {        
                    document.getElementById("submit").disabled = true;
                    document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = "lightgray"; 
                } else {
                    document.getElementById("submit").disabled = false
                    document.getElementById("submit").style.color = ""; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = ""; 
                }

                if (selectedDesaId == 0) {
                    const buttonPerkerasan = document.querySelector(".dropbtnperkerasan");
                    buttonPerkerasan.disabled = true;
                    buttonPerkerasan.style.color = "gray"; 
                    buttonPerkerasan.style.backgroundColor = "lightgray"; 
                    const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
                    dropdownPerkerasan.classList.remove("showPerkerasan");
            
                    const buttonJenis = document.querySelector(".dropbtnjenis");
                    buttonJenis.disabled = true;
                    buttonJenis.style.color = "gray"; 
                    buttonJenis.style.backgroundColor = "lightgray"; 
                    const dropdownJenis = document.getElementById("myDropdownJenis");
                    dropdownJenis.classList.remove("showJenis");
            
                    const buttonKondisi = document.querySelector(".dropbtnkondisi");
                    buttonKondisi.disabled = true;
                    buttonKondisi.style.color = "gray"; 
                    buttonKondisi.style.backgroundColor = "lightgray"; 
                    const dropdownKondisi = document.getElementById("myDropdownKondisi");
                    dropdownKondisi.classList.remove("showKondisi");
                } else {

                    const dropdownPerkerasan = document.getElementById("myDropdownPerkerasan");
                    dropdownPerkerasan.classList.remove("showPerkerasan");
            
                    const dropdownJenis = document.getElementById("myDropdownJenis");
                    dropdownJenis.classList.remove("showJenis");
            
                    const dropdownKondisi = document.getElementById("myDropdownKondisi");
                    dropdownKondisi.classList.remove("showKondisi");            
                }
                dropdown.classList.remove("showDesa");
            });
            dropdown.appendChild(option);
        });
    }
      
    function filterFunctionDesa() {
        const input = document.getElementById("myInputDesa");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownDesa");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    function myFunctionPerkerasan() {
        event.preventDefault();
        perkerasanLoad
        document.getElementById("myDropdownPerkerasan").classList.toggle("showPerkerasan");
        document.getElementById("myDropdownJenis").classList.remove("showJenis");
        document.getElementById("myDropdownKondisi").classList.remove("showKondisi");
        const dropdown = document.getElementById("myDropdownPerkerasan");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });

        // Loop melalui data dari API dan buat opsi dropdown
        perkerasanLoad.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)
                
                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedPerkerasan = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtnperkerasan");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedPerkerasan;
                selectedPerkerasanId = item.id;

                dropdown.classList.remove("showPerkerasan");

                if (!selectedPerkerasanId || !selectedJenisId || !selectedKondisiId || !selectedDesa) {        
                    document.getElementById("submit").disabled = true;
                    document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = "lightgray"; 
                } else {
                    document.getElementById("submit").disabled = false
                    document.getElementById("submit").style.color = ""; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = ""; 
                }
            });

            dropdown.appendChild(option);
        });
    }
      
    function filterFunctionPerkerasan() {
        const input = document.getElementById("myInputPerkerasan");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownPerkerasan");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    function myFunctionJenis() {
        event.preventDefault()
        document.getElementById("myDropdownJenis").classList.toggle("showJenis");
        document.getElementById("myDropdownPerkerasan").classList.remove("showPerkerasan");
        document.getElementById("myDropdownKondisi").classList.remove("showKondisi");
        const dropdown = document.getElementById("myDropdownJenis");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });

        // Loop melalui data dari API dan buat opsi dropdown
        jenisLoad.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)
                
                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedJenis = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtnjenis");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedJenis;
                selectedJenisId = item.id;

                dropdown.classList.remove("showJenis");

                if (!selectedPerkerasanId || !selectedJenisId || !selectedKondisiId || !selectedDesa) {        
                    document.getElementById("submit").disabled = true;
                    document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = "lightgray"; 
                } else {
                    document.getElementById("submit").disabled = false
                    document.getElementById("submit").style.color = ""; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = ""; 
                }
            });

            dropdown.appendChild(option);
        });
    }
      
    function filterFunctionJenis() {
        const input = document.getElementById("myInputJenis");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownJenis");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    function myFunctionKondisi() {
        event.preventDefault()
        document.getElementById("myDropdownKondisi").classList.toggle("showKondisi");
        document.getElementById("myDropdownJenis").classList.remove("showJenis");
        document.getElementById("myDropdownPerkerasan").classList.remove("showPerkerasan");
    
        const dropdown = document.getElementById("myDropdownKondisi");

        // Menghapus semua elemen <a> dari inner HTML
        dropdown.querySelectorAll("a").forEach(function(element) {
            element.remove();
        });

        // Loop melalui data dari API dan buat opsi dropdown
        kondisiLoad.forEach(item => {
            // Buat elemen anchor untuk setiap opsi dropdown
            let option = document.createElement("a");
            option.href = "#"; // Sesuaikan dengan properti yang Anda miliki dari data API
            option.textContent = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
            
            option.addEventListener("click", function(event) {
                event.preventDefault(); // Menghentikan aksi default dari elemen anchor (pindah ke URL)
                
                // Simpan nilai yang dipilih ke dalam variabel yang sesuai
                selectedKondisi = item.value; // Sesuaikan dengan properti yang Anda miliki dari data API
                const button = document.querySelector(".dropbtnkondisi");
                
                // Ubah teks placeholder dropdown menjadi nilai yang dipilih
                button.textContent = selectedKondisi;
                selectedKondisiId = item.id;

                dropdown.classList.remove("showKondisi");
                
                console.log(!selectedPerkerasan && !selectedJenis && !selectedKondisi)
                console.log(selectedPerkerasan)
                console.log(selectedJenis)
                console.log(selectedKondisi)
                
                if (!selectedPerkerasan || !selectedJenis || !selectedKondisi || !selectedDesa) {        
                    document.getElementById("submit").disabled = true;
                    document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = "lightgray"; 
                } else {
                    document.getElementById("submit").disabled = false
                    document.getElementById("submit").style.color = ""; // Warna teks menjadi abu-abu
                    document.getElementById("submit").style.backgroundColor = ""; 
                }
            });

            dropdown.appendChild(option);
        });
    }
      
    function filterFunctionKondisi() {
        const input = document.getElementById("myInputKondisi");
        const filter = input.value.toUpperCase();
        const div = document.getElementById("myDropdownKondisi");
        const a = div.getElementsByTagName("a");

        for (let i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }
    
    if (selectedDesaId == 0) {
        document.getElementById("submit").disabled = true
        document.getElementById("submit").style.color = "gray"; // Warna teks menjadi abu-abu
        document.getElementById("submit").style.backgroundColor = "lightgray"; 
    }

    document.getElementById("submit").addEventListener("click", function(event){
        event.preventDefault()
        
        console.log(selectedKabupaten);
        console.log(selectedKecamatan);
        console.log(selectedDesa);
        console.log(selectedKondisi);
        console.log(selectedJenis);
        console.log(selectedPerkerasan);
        console.log(selectedKabupatenId);

        namaRuas = document.getElementById("nama-ruas").value
        lebarRuas = document.getElementById("lebar-ruas").value
        keteranganRuas = document.getElementById("keterangan-jalan").value
        kodeRuas = document.getElementById("kode-ruas").value

        document.getElementById("kabupaten-data").textContent = selectedKabupaten;
        document.getElementById("kecamatan-data").textContent = selectedKecamatan;
        document.getElementById("desa-data").textContent = selectedDesa;
        document.getElementById("perkerasan-data").textContent = selectedPerkerasan;
        document.getElementById("jenis-data").textContent = selectedJenis;
        document.getElementById("kondisi-data").textContent = selectedKondisi;
        document.getElementById("nama-data").textContent = namaRuas;
        document.getElementById("lebar-data").textContent = lebarRuas + ' meters';
        document.getElementById("keterangan-data").textContent = keteranganRuas;
        document.getElementById("panjang-data").textContent = totalDistance.toFixed(2) + ' meters';
        document.getElementById("kode-data").textContent = kodeRuas;

        if (selectedKabupatenId == 0 || !namaRuas || !lebarRuas || !keteranganRuas || !kodeRuas || selectedJenisId == 0 || selectedKondisiId == 0 || selectedPerkerasanId == 0) {
            document.getElementById("overlay-data").style.display = "none";
            alert("Mohon isi semua Data!");
        } else {
            document.getElementById("reverse-back-mark").style.display = "block";
            document.getElementById("reverse-mark").style.display = "block";
            document.getElementById("delete-mark").style.display = "block";
            document.getElementById("overlay-data").style.display = "block";
            document.getElementById("delete-marker").style.display = "block";
            document.getElementById("hapus-marker").style.display = "none";
            document.body.scrollTop = document.documentElement.scrollHeight;
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
            hideOverlayWithoutLosingData();
        }
    });

    document.getElementById("submit-data").addEventListener("click", function(event){
        event.preventDefault()

        var namaRuas = document.getElementById("nama-ruas").value
        var lebarRuas = document.getElementById("lebar-ruas").value
        var keteranganRuas = document.getElementById("keterangan-jalan").value
        var kodeRuas = document.getElementById("kode-ruas").value
        
        console.log(encodedPath);
        console.log(selectedDesaId);
        console.log(kodeRuas);
        console.log(namaRuas);
        console.log(totalDistance.toFixed(2));
        console.log(lebarRuas);
        console.log(selectedPerkerasanId);
        console.log(selectedKondisiId);
        console.log(selectedJenisId);
        console.log(keteranganRuas);
        console.log(flag)

        if (!encodedPath || !totalDistance) {
            document.getElementById("overlay-data").style.display = "block";
            alert("Mohon tandai Jalan!");
        } else if (flag == 1) {
            const apiUrlSubmit = 'https://gisapis.manpits.xyz/api/ruasjalan';

            const data = {
                paths: encodedPath,
                desa_id: selectedDesaId,
                kode_ruas: kodeRuas,
                nama_ruas: namaRuas,
                panjang: totalDistance.toFixed(2),
                lebar: lebarRuas,
                eksisting_id: selectedPerkerasanId,
                kondisi_id: selectedKondisiId, 
                jenisjalan_id: selectedJenisId,
                keterangan: keteranganRuas 
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            };

            fetch(apiUrlSubmit, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                dataObj = JSON.parse(data)

                if (dataObj.status == "success") {
                    alert(dataObj.status)
                    document.getElementById("overlay-data").style.display = "none";
                    hideOverlay();
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                    location.reload();
                } 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else if (flag == 2 && selectedDesaId != 0) {
            const apiEditRuas = `https://gisapis.manpits.xyz/api/ruasjalan/${idClicked}`
        
            const data = {
                paths: encodedPath,
                desa_id: selectedDesaId,
                kode_ruas: kodeRuas,
                nama_ruas: namaRuas,
                panjang: totalDistance.toFixed(2),
                lebar: lebarRuas,
                eksisting_id: selectedPerkerasanId,
                kondisi_id: selectedKondisiId, 
                jenisjalan_id: selectedJenisId,
                keterangan: keteranganRuas 
            };

            const requestOptionsEditRuas = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },  
                body: JSON.stringify(data)          
            };

            fetch(apiEditRuas, requestOptionsEditRuas)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Please try again.'); 
                }
                return response.json();
            })
            .then(data => {
                alert("Data Updated");
                document.getElementById("overlay-data").style.display = "none";
                hideOverlay();
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                location.reload();
            })
            .catch(function(error) {
                alert(`Your session is Expired!`);
                localStorage.removeItem('token'); 
                window.location.href = "index.html";
            });
        }
    })

    document.getElementById("edit-info").addEventListener("click", function(event){
        event.preventDefault()
        document.querySelector(".overlay-input").style.display = "flex";
        document.body.scrollTop = document.documentElement.scrollHeight;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        document.getElementById("overlay-data").style.display = "none";
        document.getElementById("delete-marker").style.display = "none";
        document.getElementById("delete-mark").style.display = "none";
        document.getElementById("reverse-back-mark").style.display = "none";
        document.getElementById("reverse-mark").style.display = "none";
        document.getElementById("table-overlay").style.display = "none";
        document.getElementById("checkbox-road-view").style.display = "block";
        document.getElementById("tanah").textContent = "Tanah: ";
        document.getElementById("tanah-beton").textContent = "Tanah/Beton: ";
        document.getElementById("perkerasanbahan").textContent = "Perkerasan: ";
        document.getElementById("koral").textContent = "Koral: ";
        document.getElementById("lapen").textContent = "Lapen: ";
        document.getElementById("paving").textContent = "Paving: ";
        document.getElementById("hotmix").textContent = "Hotmix: ";
        document.getElementById("beton").textContent = "Beton: ";
        document.getElementById("beton-lapen").textContent = "Beton/Lapen: ";
    });

    function hideOverlayWithoutLosingData() {
        event.preventDefault()
        document.querySelector(".overlay-input").style.display = "none";
    }

    window.onscroll = function() {scrollFunction()};
        
    function scrollFunction() {
        var scrollToTopBtn = document.getElementById("scrollToTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }

    function scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

}

