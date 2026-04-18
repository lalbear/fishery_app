-- Migration 016: Expand geographic_zones to cover all Indian states with full district names
-- Fixes: (1) only 6 states in DB causing wrong auto-locate default (AP/EG)
--        (2) district_codes stored as short codes (EG, WG) instead of full names
--        (3) districts missing for most of India

-- Step 1: widen the column so full district names fit (was VARCHAR(10))
ALTER TABLE geographic_zones ALTER COLUMN district_codes TYPE VARCHAR(100)[] USING district_codes::VARCHAR(100)[];

-- Step 2: remove the old 6 stub zones and replace with complete all-India data
DELETE FROM geographic_zones;

-- Step 3: insert all states/UTs — zone_name is the full state name so pickers display correctly
INSERT INTO geographic_zones (zone_name, state_code, district_codes, groundwater_salinity_min, groundwater_salinity_max, water_classification, suitable_systems) VALUES

('Andhra Pradesh', 'AP', ARRAY['East Godavari','West Godavari','Krishna','Guntur','Nellore','Srikakulam','Vizianagaram','Visakhapatnam','Prakasam','Kurnool','Kadapa','Chittoor','Anantapur'], 500.0, 2500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

('Arunachal Pradesh', 'AR', ARRAY['East Siang','West Siang','Upper Siang','Lower Subansiri','Upper Subansiri','Papum Pare','Tawang','Changlang','Tirap','Lohit','Longding','Namsai'], 100.0, 500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Assam', 'AS', ARRAY['Kamrup','Nagaon','Jorhat','Dibrugarh','Tinsukia','Golaghat','Barpeta','Dhubri','Cachar','Lakhimpur','Sonitpur','Morigaon','Hojai','Biswanath','Majuli'], 100.0, 600.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Bihar', 'BR', ARRAY['Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Purnia','Araria','Samastipur','Vaishali','Sitamarhi','Saran','Siwan','Gopalganj','Buxar','Nalanda','Rohtas','Aurangabad','Kaimur','Jamui','Munger'], 200.0, 800.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Chhattisgarh', 'CT', ARRAY['Raipur','Bilaspur','Durg','Rajnandgaon','Raigarh','Korba','Jashpur','Surguja','Bastar','Jagdalpur','Kanker','Kondagaon','Narayanpur','Bijapur','Sukma'], 200.0, 700.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Goa', 'GA', ARRAY['North Goa','South Goa'], 300.0, 2000.0, 'BRACKISH', ARRAY['BRACKISH_POND','TRADITIONAL_POND']),

('Gujarat', 'GJ', ARRAY['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Amreli','Anand','Navsari','Bharuch','Valsad','Porbandar','Devbhoomi Dwarka','Gir Somnath','Morbi','Kutch'], 1500.0, 5000.0, 'BRACKISH', ARRAY['BRACKISH_POND']),

('Haryana', 'HR', ARRAY['Gurugram','Faridabad','Hisar','Rohtak','Ambala','Karnal','Panipat','Sonipat','Yamunanagar','Kurukshetra','Jind','Kaithal','Rewari','Jhajjar','Bhiwani','Sirsa','Fatehabad'], 2000.0, 3500.0, 'BRACKISH', ARRAY['BRACKISH_POND']),

('Himachal Pradesh', 'HP', ARRAY['Shimla','Kangra','Mandi','Kullu','Solan','Una','Hamirpur','Bilaspur','Chamba','Sirmaur','Kinnaur','Lahaul and Spiti'], 100.0, 300.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Jharkhand', 'JH', ARRAY['Ranchi','Dhanbad','Bokaro','Jamshedpur','Hazaribagh','Deoghar','Giridih','Dumka','Palamu','Gumla','Latehar','Khunti','Ramgarh','Chatra','Koderma','Pakur','Godda','Sahibganj','Jamtara','Lohardaga','Simdega','Seraikela Kharsawan','West Singhbhum','East Singhbhum'], 100.0, 500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Karnataka', 'KA', ARRAY['Bengaluru Urban','Mysuru','Tumkur','Dakshina Kannada','Uttara Kannada','Udupi','Shimoga','Hassan','Belagavi','Dharwad','Bidar','Kolar','Chikkaballapur','Ramanagara','Mandya','Chamrajanagar','Kodagu','Chikkamagaluru','Davanagere','Haveri','Gadag','Vijayapura','Bagalkot','Koppal','Raichur','Yadgir','Kalaburagi'], 300.0, 1500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

('Kerala', 'KL', ARRAY['Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'], 500.0, 3000.0, 'BRACKISH', ARRAY['BRACKISH_POND','TRADITIONAL_POND']),

('Madhya Pradesh', 'MP', ARRAY['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Rewa','Satna','Chhindwara','Hoshangabad','Raisen','Vidisha','Narsinghpur','Seoni','Mandla','Balaghat','Dindori','Umaria','Shahdol','Anuppur','Katni','Damoh','Panna','Chhatarpur','Tikamgarh','Datia','Shivpuri','Guna','Ashoknagar','Betul','Harda','Khandwa','Khargone','Barwani','Dhar','Jhabua','Alirajpur','Ratlam','Mandsaur','Neemuch','Agar Malwa','Shajapur','Dewas'], 200.0, 800.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Maharashtra', 'MH', ARRAY['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Solapur','Amravati','Raigad','Ratnagiri','Sindhudurg','Thane','Kolhapur','Sangli','Satara','Nanded','Latur','Osmanabad','Jalna','Beed','Parbhani','Hingoli','Akola','Washim','Yavatmal','Wardha','Chandrapur','Gadchiroli','Bhandara','Gondia','Nandurbar','Dhule','Jalgaon','Ahmednagar','Buldhana','Palghar'], 400.0, 2000.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

('Manipur', 'MN', ARRAY['Imphal West','Imphal East','Bishnupur','Thoubal','Churachandpur','Senapati','Ukhrul','Chandel','Jiribam','Kangpokpi','Kamjong','Noney','Pherzawl','Tengnoupal'], 100.0, 400.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Meghalaya', 'ML', ARRAY['East Khasi Hills','West Khasi Hills','Ri Bhoi','East Jaintia Hills','West Jaintia Hills','East Garo Hills','West Garo Hills','South Garo Hills','Eastern West Khasi Hills','North Garo Hills'], 100.0, 400.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Mizoram', 'MZ', ARRAY['Aizawl','Lunglei','Champhai','Serchhip','Kolasib','Lawngtlai','Mamit','Siaha','Khawzawl','Hnahthial','Saitual'], 100.0, 400.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Nagaland', 'NL', ARRAY['Kohima','Dimapur','Mokokchung','Wokha','Zunheboto','Tuensang','Mon','Phek','Kiphire','Longleng','Peren','Noklak'], 100.0, 400.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Odisha', 'OR', ARRAY['Bhubaneswar','Cuttack','Puri','Berhampur','Balasore','Bhadrak','Kendrapara','Jagatsinghpur','Ganjam','Jajpur','Khordha','Nayagarh','Mayurbhanj','Keonjhar','Dhenkanal','Angul','Sambalpur','Bargarh','Jharsuguda','Sundargarh','Rourkela','Nuapada','Bolangir','Boudh','Subarnapur','Kandhamal','Rayagada','Koraput','Malkangiri','Nabarangpur','Kalahandi','Deogarh','Gajapati'], 100.0, 1500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

('Punjab', 'PB', ARRAY['Amritsar','Ludhiana','Jalandhar','Patiala','Bathinda','Mohali','Gurdaspur','Hoshiarpur','Firozpur','Moga','Faridkot','Mansa','Muktsar','Barnala','Fatehgarh Sahib','Kapurthala','Nawanshahr','Ropar','Sangrur','Tarn Taran','Pathankot'], 500.0, 1500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Rajasthan', 'RJ', ARRAY['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Bharatpur','Alwar','Barmer','Chittorgarh','Jhunjhunu','Sikar','Pali','Jaisalmer','Jalore','Sirohi','Nagaur','Tonk','Bundi','Baran','Jhalawar','Sawai Madhopur','Karauli','Dholpur','Dausa','Rajsamand','Bhilwara','Dungarpur','Banswara','Pratapgarh'], 3000.0, 8000.0, 'SALINE', ARRAY['BRACKISH_POND']),

('Sikkim', 'SK', ARRAY['East Sikkim','West Sikkim','North Sikkim','South Sikkim'], 100.0, 300.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Tamil Nadu', 'TN', ARRAY['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Thanjavur','Nagapattinam','Cuddalore','Villupuram','Ramanathapuram','Thoothukudi','Kanyakumari','Vellore','Tiruvannamalai','Dharmapuri','Krishnagiri','Erode','Tiruppur','Nilgiris','Karur','Perambalur','Ariyalur','Pudukkottai','Sivaganga','Virudhunagar','Theni','Dindigul','Namakkal','Tiruvarur','Myladuthurai'], 300.0, 2500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

('Telangana', 'TG', ARRAY['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Nalgonda','Medak','Rangareddy','Mahabubnagar','Adilabad','Nirmal','Jagitial','Rajanna Sircilla','Peddapalli','Jayashankar Bhupalpally','Bhadradri Kothagudem','Yadadri Bhuvanagiri','Medchal','Vikarabad','Sangareddy','Siddipet','Kamareddy','Jangaon','Hanamkonda','Mulugu','Narayanpet','Jogulamba Gadwal','Wanaparthy','Nagarkurnool','Suryapet'], 300.0, 1200.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Tripura', 'TR', ARRAY['West Tripura','South Tripura','North Tripura','Gomati','Khowai','Sepahijala','Unokoti','Dhalai'], 100.0, 500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('Uttar Pradesh', 'UP', ARRAY['Lucknow','Kanpur','Agra','Varanasi','Allahabad','Meerut','Gorakhpur','Bareilly','Aligarh','Moradabad','Saharanpur','Ghaziabad','Mathura','Muzaffarnagar','Bulandshahr','Etah','Etawah','Fatehpur','Gonda','Bahraich','Lakhimpur Kheri','Sitapur','Hardoi','Unnao','Rae Bareli','Amethi','Sultanpur','Faizabad','Ambedkar Nagar','Azamgarh','Mau','Ballia','Deoria','Kushinagar','Maharajganj','Siddharthnagar','Sant Kabir Nagar','Basti','Jaunpur','Ghazipur','Chandauli','Mirzapur','Sonbhadra','Hamirpur','Mahoba','Banda','Chitrakoot','Jhansi','Lalitpur','Jaloun','Auraiya','Kanpur Dehat','Farrukhabad','Kannauj','Mainpuri','Firozabad','Hathras','Budaun','Rampur','Amroha','Bijnor','Hapur','Shamli','Baghpat'], 200.0, 600.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC']),

('Uttarakhand', 'UT', ARRAY['Dehradun','Haridwar','Nainital','Udham Singh Nagar','Almora','Pauri Garhwal','Tehri Garhwal','Chamoli','Pithoragarh','Champawat','Rudraprayag','Bageshwar','Uttarkashi'], 100.0, 400.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),

('West Bengal', 'WB', ARRAY['Kolkata','North 24 Parganas','South 24 Parganas','Howrah','Hooghly','Burdwan','Murshidabad','Nadia','Medinipur East','Medinipur West','Jalpaiguri','Malda','Cooch Behar','Darjeeling','Alipurduar','Kalimpong','Birbhum','Bankura','Purulia','Jhargram'], 100.0, 1500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND','BIOFLOC','BRACKISH_POND']),

-- Union Territories
('Andaman and Nicobar Islands', 'AN', ARRAY['North and Middle Andaman','South Andaman','Nicobars'], 500.0, 3000.0, 'BRACKISH', ARRAY['BRACKISH_POND','TRADITIONAL_POND']),
('Delhi', 'DL', ARRAY['Central Delhi','North Delhi','South Delhi','East Delhi','West Delhi','New Delhi','North East Delhi','South West Delhi','North West Delhi','Shahdara','South East Delhi'], 400.0, 1200.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),
('Jammu and Kashmir', 'JK', ARRAY['Srinagar','Jammu','Anantnag','Baramulla','Pulwama','Kupwara','Budgam','Kathua','Udhampur','Rajouri','Poonch','Ramban','Reasi','Samba','Shopian','Kulgam','Bandipora','Ganderbal','Doda','Kishtwar'], 100.0, 500.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),
('Ladakh', 'LA', ARRAY['Leh','Kargil'], 100.0, 300.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),
('Puducherry', 'PY', ARRAY['Puducherry','Karaikal','Mahe','Yanam'], 400.0, 2500.0, 'BRACKISH', ARRAY['BRACKISH_POND','TRADITIONAL_POND']),
('Chandigarh', 'CH', ARRAY['Chandigarh'], 300.0, 800.0, 'FRESHWATER', ARRAY['TRADITIONAL_POND']),
('Lakshadweep', 'LD', ARRAY['Lakshadweep'], 500.0, 3000.0, 'BRACKISH', ARRAY['BRACKISH_POND']),
('Dadra and Nagar Haveli and Daman and Diu', 'DN', ARRAY['Dadra and Nagar Haveli','Daman','Diu'], 300.0, 2000.0, 'BRACKISH', ARRAY['BRACKISH_POND','TRADITIONAL_POND']);
