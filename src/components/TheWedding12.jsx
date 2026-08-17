import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaVolumeMute, FaVolumeUp, } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient'; // atau sesuaikan path-nya



function CopyRekening({ number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal salin:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
    >
      {copied ? "✅ Disalin!" : "📋 Salin Nomor"}
    </button>
  );
}


export default function WeddingInvitation() {
  const [showIntro, setShowIntro] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  // const [countdown, setCountdown] = useState('');
  const audioRef = useRef(null);
  const [wishes, setWishes] = useState([]); 
  const [guestName, setGuestName] = useState('');
  const [wishInput, setWishInput] = useState('');
  const audioRefIntro = useRef(null); // Audio untuk intro
  const audioRefMain = useRef(null); // Audio untuk musik utama
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedQRIS, setSelectedQRIS] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const wishesPerPage = 5; // Jumlah per halaman
  // const indexOfLastWish = currentPage * wishesPerPage;
  // const indexOfFirstWish = indexOfLastWish - wishesPerPage;
  // const [showModal, setShowModal] = useState(false);
  // const [showRSVP,  setShowRSVP]  = useState(false); 
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [bgIndex, setBgIndex] = useState(0);
  // const [hasInteracted, setHasInteracted] = useState(false);


  

const params = new URLSearchParams(window.location.search);

const guestFromUrl = params.get('to');

const guestDisplayName = guestFromUrl
  ? guestFromUrl.replace(/\b\w/g, (char) => char.toUpperCase())
  : 'You';

const profiles = [
  {
    id: 'primary',
    name: guestDisplayName,
    avatar: '/Netflix-avatar.png',
  },
];

const [phase, setPhase] = useState('intro');
const [selectedProfile, setSelectedProfile] = useState(null);

// Slideshow effect
// useEffect(() => {
//   let interval;
//   if (isPlaying) {
//     interval = setInterval(() => {
//       setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
//     }, 3000); // ganti gambar setiap 3 detik
//   } else {
//     clearInterval(interval);
//   }
//   return () => clearInterval(interval);
// }, [isPlaying]);


 useEffect(() => {
  if (showIntro && audioRefIntro.current) {
    audioRefIntro.current.muted = isMuted;
    audioRefIntro.current.play().catch((e) =>
      console.log("Autoplay blocked:", e)
    );
  }
}, [showIntro, isMuted]);

useEffect(() => {
  if (showIntro) {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setPhase('profile');  // langsung ke profile scene!
    }, 3500);
    return () => clearTimeout(timer);
  }
}, [showIntro]);

useEffect(() => {
  if (phase === "main" && audioRefMain.current) {
    audioRefMain.current
      .play()
      .then(() => {
        console.log("🎵 Musik dimulai otomatis");
        setAudioBlocked(false);
      })
      .catch((err) => {
        console.warn("🔇 Autoplay gagal:", err);
        setAudioBlocked(true); // Tombol akan muncul
      });
  }
}, [phase]);


//   // Play audio on intro
//  useEffect(() => {
//   if (showIntro && audioRef.current) {
//     audioRef.current.muted = isMuted;
//     audioRef.current.play().catch((e) =>
//       console.log("Autoplay blocked:", e)
//     );
//   }
// }, [showIntro]);


  // Scroll detection to hide poster
useEffect(() => {
  const handleScroll = () => {
    const posterEl = document.getElementById('opening-poster');

    if (
      posterEl &&
      !showPoster &&
      window.scrollY > posterEl.offsetHeight * 0.6
    ) {
      setShowPoster(false);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [showPoster]);


  // useEffect(() => {
  //   console.log("audioRef:", audioRef.current); 
  // }, []);

  // Fungsi untuk menangani klik pada profil dan memulai musik
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setPhase('main'); 

    // console.log("audioRef:", audioRef.current);

  //  if (audioRef.current) {
  //   console.log("Audio is playing..."); 
  //   audioRef.current.play().catch((e) => console.log("Autoplay blocked:", e)); 
  // } else {
  //   console.log("Audio element not found"); 
  // }
  };

 const toggleMute = () => {
  setIsMuted((prev) => {
    const newMuteState = !prev;
    if (audioRefIntro.current) audioRefIntro.current.muted = newMuteState;
    if (audioRefMain.current) audioRefMain.current.muted = newMuteState;
    return newMuteState;
  });
};

  // useEffect(() => {
  //   if (showIntro && audioRef.current) {
  //     audioRef.current.muted = isMuted; 
  //     audioRef.current.play().catch((e) => console.log("Autoplay blocked:", e)); 
  //   }
  // }, [showIntro, isMuted]);

  const scrollToHero = () => {
    const el = document.getElementById('hero');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setShowPoster(false);
  };

  const [isDark, setIsDark] = useState(true);

    useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);



    
// Saat Kirim Ucapan
const handleSubmitWish = async () => {
  const newWish = {
    name: guestName.trim(),
    message: wishInput.trim(),
    color: '#ffffff',
  };

  const { data, error } = await supabase
    .from('wishes')
    .insert([newWish])
    .select();

  if (error) {
    console.error('❌ Gagal menyimpan ke Supabase:', error.message);
  } else {
    console.log('✅ Berhasil menyimpan:', data);
    setWishes((prev) => [data[0], ...prev]);
    setWishInput('');
    setGuestName('');
  }
};

// Fetch wishes awal
useEffect(() => {
  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setWishes(data);
  };

  fetchWishes();
}, []);


// Realtime update (opsional)
useEffect(() => {
  const channel = supabase
    .channel('realtime-wishes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'wishes',
    }, (payload) => {
      setWishes((prev) => [payload.new, ...prev]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);

// Ambil semua wish saat pertama load
// useEffect(() => {
//   const fetchWishes = async () => {
//     const { data, error } = await supabase.from('wishes').select('*').order('created_at', { ascending: false });
//     if (error) {
//       console.error('Gagal fetch wishes:', error.message);
//     } else {
//       setWishes(data);
//     }
//   };

//   if (isGuestConfirmed) {
//     fetchWishes();
//   }
// }, [isGuestConfirmed]);

// untuk auto reload wishes realtime
// useEffect(() => {
//   if (!isGuestConfirmed) return;

//   const channel = supabase
//     .channel('realtime-wishes')
//     .on('postgres_changes', {
//       event: 'INSERT',
//       schema: 'public',
//       table: 'wishes',
//     }, (payload) => {
//       setWishes((prev) => [payload.new, ...prev]);
//     })
//     .subscribe();

//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, [isGuestConfirmed]);

// Saat Kirim Doa
// const handleSubmitWish = async () => {
//   if (!wishInput.trim()) return;

//   const newWish = {
//     name: guestName || 'Tamu',
//     message: wishInput.trim(),
//     emoji: emojis[Math.floor(Math.random() * emojis.length)],
//   };

//   const { data, error } = await supabase
//     .from('wishes')
//     .insert([newWish])
//     .select();

//   if (error) {
//     console.error('❌ Gagal menyimpan ke Supabase:', error.message);
//   } else {
//     setWishes((prev) => [data[0], ...prev]); // ⬅️ langsung tambahkan ke UI
//     setWishInput('');
//   }
// };



  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans overflow-x-hidden relative scroll-smooth">
      <audio ref={audioRefMain} src="/sound/backsound1.mp3" preload="auto" />
      <AnimatePresence>
     {phase === 'profile' && (
  <motion.section
    className="fixed inset-0 bg-black text-white z-40 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* BACKGROUND */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('/ep1.webp')",
      }}
    />

    {/* OVERLAY HITAM DI BAGIAN BAWAH */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/95" />

    {/* ISI */}
    <div className="relative z-10 h-full flex flex-col justify-end">

      {/* INFO */}
      <div className="text-center mb-8 px-4">

  <p className="text-xs md:text-sm tracking-widest font-semibold uppercase mb-4">
    WE INVITE YOU TO CELEBRATE
  </p>

  <h1 className="text-4xl md:text-6xl font-serif italic mb-4">
    Arif & Nazah
  </h1>

  <p className="text-xs md:text-sm tracking-[0.2em] font-semibold uppercase mb-8">
    Thursday, 17 September, 2026
  </p>

  <p className="text-xl md:text-2xl font-serif italic">
    Dear
  </p>

</div>

      {/* PROFILE */}
      <div className="w-full px-4 pb-10">
        <div
          className={
            profiles.length === 1
              ? "flex justify-center"
              : "flex justify-center flex-wrap gap-5 md:gap-8"
          }
        >
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                handleProfileClick(p);
                setPhase('main');
              }}
              className="
                flex flex-col items-center
                focus:outline-none
                transition-transform
                hover:scale-105
                active:scale-95
              "
            >
              {/* FOTO PROFILE */}
              <img
                src={p.avatar}
                alt={p.name}
                className="
                  w-24 h-24
                  sm:w-28 sm:h-28
                  md:w-32 md:h-32
                  rounded-2xl
                  object-cover
                  shadow-2xl
                "
              />

              {/* NAMA */}
              <span className="mt-3 text-sm sm:text-base md:text-lg text-white font-bold max-w-[130px] truncate">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  </motion.section>
)}


{phase === 'main' && (
// Di dalam WeddingInvitation.jsx setelah pilih profile
 <section className="relative w-full h-screen scrollbar-hide overflow-hidden">
  {/* Tombol Musik */}
   {audioBlocked && (
  <button
    onClick={() => {
      if (audioRefMain.current) {
        audioRefMain.current.play();
        setAudioBlocked(false);
      }
    }}
    className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full z-[99] shadow-lg"
  >
    🔊 Mainkan Musik
  </button>
)}
  {/* Gambar sebagai latar belakang fullscreen */}
  <img
    src="/aw.webp" // ← ganti dengan gambar kamu
    alt="Poster Prewed"
    className="absolute inset-0 w-full h-full object-cover object-top z-"
  />

  {/* Overlay hitam transparan agar teks tetap terbaca */}
  <div className="absolute inset-0 bg-black/55 md:bg-black/75  z-10"></div>

  {/* Konten di atas gambar */}
  <div className="relative z-20 flex flex-col items-start justify-end h-full px-6 md:px-20 pb-16 text-left text-white">

 {/* NIKAHFIX - SVG curved */}
 <div className="-mb-2 lg:-mb-2 md:ml-0 lg:-ml-8">
  <svg viewBox="0 0 400 51" className="w-40 h-20 md:w-56 md:h-20 lg:w-64 lg:h-28">
    <defs>
      <path id="curve" d="M20,90 Q200,0 400,80" fill="transparent" />
        {/* Filter untuk bayangan */}
      <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="black" floodOpacity="0.4"/>
      </filter>
    </defs>
    <text
      fontSize="140"
      className="fill-red-600 font-black tracking-wide font-bebas"
    >
      <textPath href="#curve" startOffset="48%" textAnchor="middle">
        RifNaz
      </textPath>
    </text>
  </svg>
</div>

    <h1 className="text-3xl md:text-5xl font-extrabold leading-tigh lg:-ml-8">
      Arif & Nazah: <br /> Sebelum Hari H
    </h1>

    <div className="flex items-center gap-3 mt-3 lg:-ml-8">
      <span className="bg-red-600 text-white text-xs md:text-sm px-3 py-1 rounded-full font-semibold shadow">
        Coming soon
      </span>
      <span className="text-sm">•   17 September 2026</span>
    </div>
     {/* Kontrol Volume */}
      <div className="absolute top-4 right-4 z-20">
          <button onClick={toggleMute} className="text-white">
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
      </div>

    {/* Tagar */}
    <div className="flex gap-2 mt-4 flex-wrap justify-start md:justify-start text-xs md:text-sm text-white/80 lg:-ml-8">
      {['#Romantic', '#Getmarried', '#Family', '#Documenter'].map((tag, idx) => (
        <span
          key={idx}
          className="bg-gray-600 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm font-semibold"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
</section>
)}


{/* section 2 */}
<section className="relative w-full text-white py-20 px-6 md:px-20 overflow-hidden">
  {/* Background Parallax */}
<div
  className="absolute inset-0 bg-scroll md:bg-fixed bg-center bg-cover z-0"
  style={{ backgroundImage: "url('/awe2.webp')" }}
>
    <div className="w-full h-full bg-black/80"></div> {/* Overlay */}
  </div>

  {/* Konten di atas background */}
  <motion.div
    className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
    {/* Gambar Kanan */}
    <motion.div
      className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <img
        src="/awe2.webp"
        alt="Poster"
        className="w-full h-auto object-cover ease-in-out duration-300 hover:scale-105 rounded-lg shadow-lg"
      />
    </motion.div>

    {/* Konten Tulisan */}
    <motion.div
      className="w-full md:w-1/2 space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <p className="uppercase text-red-500 text-sm font-semibold tracking-wide">Documenter</p>
      <h2 className="text-3xl md:text-4xl font-extrabold leading-snug">Arif & Nazah: Sebelum Hari H</h2>

      <div className="flex items-center gap-4 text-sm text-white/80">
        <span className="text-green-400 font-semibold">100% Match</span>
        <span className="bg-white text-black px-2 rounded text-xs font-bold">SU</span>
        <span>2026</span>
        <span>1h 16m</span>
      </div>

      <div className="bg-red-600 text-white w-fit px-4 py-1 rounded-full text-sm font-semibold shadow-md">
        Coming soon on Thursday, 17 September 2026
      </div>

      <p className="text-sm md:text-base text-white/80">
        Dengan kuasa Allah SWT., Arif dan Nazah dipertemukan dalam situasi yang tepat. Arus membawa mereka ke jenjang yang lebih serius ketika keduanya bertekat untuk saling mengikat, menyempurnakan separuh agama.

      </p>

      <p className="text-xs italic text-white/50 border-t border-white/10 pt-2">
        "Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)" – (Q.S Az-Zariyat: 49)
      </p>
    </motion.div>
  </motion.div>
</section>

{/* SECTION 3 - BREAKING NEWS */}
<section
  className="
    relative
    w-full
    text-white
    px-6
    py-16
    md:py-24
    bg-center
    bg-cover
    overflow-hidden
    bg-scroll
    md:bg-fixed
  "
  style={{
    backgroundImage: "url('/love2.webp')",
  }}
>
  {/* OVERLAY BACKGROUND */}
  <div className="absolute inset-0 bg-black/65"></div>

  {/* ORNAMEN BACKGROUND */}
  <div className="hidden md:block absolute top-10 left-5 text-[#f6d58a]/10 text-8xl select-none">
    ❧
  </div>

  <div className="hidden md:block absolute bottom-10 right-5 text-[#f6d58a]/10 text-7xl select-none">
    ♡
  </div>


  {/* KONTEN UTAMA */}
  <motion.div
    className="relative z-10 max-w-3xl mx-auto flex flex-col items-center"
    initial={{ opacity: 0, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true, amount: 0.15 }}
  >

    {/* ================= JUDUL ================= */}
    <motion.div
      className="text-center mb-8 w-full"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <p className="text-[#f6d58a] text-xs tracking-[4px] mb-2">
        SPECIAL ANNOUNCEMENT
      </p>

      <h3 className="text-2xl md:text-3xl font-bold">
        Breaking News 📺
      </h3>

      {/* GARIS LOVE */}
      <div className="flex items-center justify-center gap-3 mt-4">

        <div className="w-14 md:w-24 h-px bg-[#f6d58a]/70"></div>

        <span className="text-[#f6d58a] text-lg">
          ❧ ♥ ❧
        </span>

        <div className="w-14 md:w-24 h-px bg-[#f6d58a]/70"></div>

      </div>
    </motion.div>


    {/* ================= FOTO ================= */}
    <motion.div
      className="
        relative
        w-full
        aspect-[3/2]
        md:aspect-video
        rounded-2xl
        overflow-hidden
        border
        border-[#f6d58a]/40
        shadow-2xl
        bg-zinc-900
      "
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true, amount: 0.15 }}
    >

      <img
        src="/rifbreaking.webp"
        alt="Pengumuman Pernikahan"
        loading="lazy"
        decoding="async"
        className="
          block
          w-full
          h-full
          object-cover
          object-[center_83%]
          rounded-2xl
          transition-transform
          duration-500
          hover:scale-105
        "
      />

      {/* FRAME GOLD */}
      <div className="absolute inset-2 rounded-xl border border-[#f6d58a]/30 pointer-events-none"></div>

      {/* LOVE */}
      <motion.div
        className="absolute top-3 right-3 text-[#f6d58a] text-xl drop-shadow-md"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
      >
        ♥
      </motion.div>

    </motion.div>


    {/* ================= TEKS ================= */}
    <motion.div
      className="
        w-full
        mt-7
        text-left
        space-y-4
        text-sm
        md:text-base
        leading-relaxed
      "
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      viewport={{ once: true, amount: 0.15 }}
    >

      {/* JUDUL BERITA */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <span className="text-[#f6d58a]">
          ✦
        </span>

        <strong className="text-base md:text-lg">
          We’re Getting Married!
        </strong>

        <span className="text-[#f6d58a]">
          ✦
        </span>
      </motion.div>


      {/* PARAGRAF 1 */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        viewport={{ once: true, amount: 0.15 }}
        className="text-white/85"
      >
        Dengan segala kerendahan hati, kami mengundang{" "}
        <strong className="text-white">
          Bapak/Ibu, sahabat, keluarga, serta kerabat terkasih
        </strong>{" "}
        untuk hadir dan memberikan doa restu pada acara pernikahan kami.
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
        Bapak/Ibu berkenan hadir.
      </motion.p>


      {/* PARAGRAF 2 */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
        className="text-white/85"
      >
        Mohon doanya agar acara kami diberi kelancaran dan keberkahan. 🤍
      </motion.p>

    </motion.div>


    {/* ================= ORNAMEN BAWAH ================= */}
    <motion.div
      className="flex items-center justify-center gap-3 mt-9"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      viewport={{ once: true, amount: 0.15 }}
    >

      <div className="w-16 md:w-24 h-px bg-[#f6d58a]/50"></div>

      <span className="text-[#f6d58a] text-sm">
        ✦ ❧ ♥ ❧ ✦
      </span>

      <div className="w-16 md:w-24 h-px bg-[#f6d58a]/50"></div>

    </motion.div>

  </motion.div>
</section>

{/* SECTION 4 - BRIDE AND GROOM */}
<section
  className="relative w-full text-white py-20 px-6 md:px-20 bg-center bg-cover overflow-hidden
             bg-scroll md:bg-fixed"
  style={{ backgroundImage: "url('/backbre.webp')" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/55"></div>

  <motion.div
    className="relative z-10 max-w-5xl mx-auto"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true, amount: 0.15 }}
  >

    {/* ================= TITLE ================= */}
    <h3 className="text-3xl md:text-5xl font-serif font-bold text-center">
      Bride and Groom 💐
    </h3>

    {/* GARIS LOVE DI BAWAH JUDUL */}
    <div className="flex items-center justify-center gap-3 mt-4 mb-10">
      <div className="h-px w-24 md:w-36 bg-[#f6d58a]/80"></div>

      <span className="text-[#f6d58a] text-lg">
        ❧ ♥ ❧
      </span>

      <div className="h-px w-24 md:w-36 bg-[#f6d58a]/80"></div>
    </div>


    {/* ================= BRIDE & GROOM ================= */}
    <div className="grid grid-cols-2 gap-6 md:gap-10">

      {/* ================= BRIDE ================= */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true, amount: 0.15 }}
      >

        {/* FOTO */}
        <img
          src="/nazah.webp"
          alt="Nazah Auliana"
          className="
            w-36 h-48
            md:w-48 md:h-64
            object-cover
            rounded-xl
            shadow-2xl
            border border-white/60
          "
        />

        {/* NAMA */}
        <motion.h4
          className="
            text-xl md:text-3xl
            font-serif
            font-semibold
            mt-5
          "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Nazah Auliana
        </motion.h4>

        {/* GARIS LOVE */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-4">
          <div className="h-px w-12 md:w-20 bg-[#f6d58a]/80"></div>

          <span className="text-[#f6d58a] text-sm">
            ❧ ♥ ❧
          </span>

          <div className="h-px w-12 md:w-20 bg-[#f6d58a]/80"></div>
        </div>

        {/* ORANG TUA */}
        <motion.p
          className="
            text-xs md:text-base
            text-white/90
            max-w-xs
            leading-relaxed
          "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Putri dari{" "}
          <span className="font-bold">
            Bapak Nana Rohayana
          </span>{" "}
          &{" "}
          <span className="font-bold">
            Ibu Siti Khodijah
          </span>
        </motion.p>

      </motion.div>


      {/* ================= GROOM ================= */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true, amount: 0.15 }}
      >

        {/* FOTO */}
        <img
          src="/arif.webp"
          alt="Arif Hidayat"
          className="
            w-36 h-48
            md:w-48 md:h-64
            object-cover
            rounded-xl
            shadow-2xl
            border border-white/60
          "
        />

        {/* NAMA */}
        <motion.h4
          className="
            text-xl md:text-3xl
            font-serif
            font-semibold
            mt-5
          "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Arif Hidayat
        </motion.h4>

        {/* GARIS LOVE */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-4">
          <div className="h-px w-12 md:w-20 bg-[#f6d58a]/80"></div>

          <span className="text-[#f6d58a] text-sm">
            ❧ ♥ ❧
          </span>

          <div className="h-px w-12 md:w-20 bg-[#f6d58a]/80"></div>
        </div>

        {/* ORANG TUA */}
        <motion.p
          className="
            text-xs md:text-base
            text-white/90
            max-w-xs
            leading-relaxed
          "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Putra dari{" "}
          <span className="font-bold">
            Bapak Gunara
          </span>{" "}
          &{" "}
          <span className="font-bold">
            Ibu Nenden
          </span>
        </motion.p>

      </motion.div>

    </div>

  </motion.div>
</section>

{/* SECTION 5 */}
<section
  className="
    relative
    w-full
    text-white
    py-20
    px-6
    md:px-20
    bg-center
    bg-cover
    overflow-hidden
    bg-scroll
    md:bg-fixed
  "
  style={{
    backgroundImage: "url('/backlokasi.webp')",
  }}
>
  {/* OVERLAY FOTO */}
  <div className="absolute inset-0 bg-black/65"></div>

  {/* ISI SECTION */}
  <div className="relative z-10 max-w-4xl mx-auto">

    {/* ================= TANGGAL & JADWAL ================= */}
    <div className="text-center">

      {/* SAVE THE DATE */}
      <motion.p
        className="text-[#f6d58a] text-xs md:text-sm tracking-[4px] mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        SAVE THE DATE
      </motion.p>

      {/* TANGGAL */}
      <motion.h2
        className="text-xl md:text-4xl font-semibold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        Kamis, 17 September 2026
      </motion.h2>

      {/* GARIS LOVE */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-9"
        initial={{ opacity: 0, scaleX: 0.5 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="h-px w-16 md:w-28 bg-[#f6d58a]/80"></div>

        <span className="text-[#f6d58a] text-lg">
          ❧ ♥ ❧
        </span>

        <div className="h-px w-16 md:w-28 bg-[#f6d58a]/80"></div>
      </motion.div>


      {/* ================= AKAD & RESEPSI ================= */}
      <div className="grid grid-cols-2 max-w-xl mx-auto">

        {/* AKAD */}
        <motion.div
          className="text-center px-4 border-r border-[#f6d58a]/60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <h3 className="text-lg md:text-xl font-semibold">
            AKAD NIKAH
          </h3>

          <motion.div
            className="text-[#f6d58a] text-xs mt-2 mb-2"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            ✦
          </motion.div>

          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            🕘 &nbsp;Jam : 08.00 WIB s/d
            <br />
            Selesai.
          </p>
        </motion.div>


        {/* RESEPSI */}
        <motion.div
          className="text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <h3 className="text-lg md:text-xl font-semibold">
            RESEPSI
          </h3>

          <motion.div
            className="text-[#f6d58a] text-xs mt-2 mb-2"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            ✦
          </motion.div>

          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            🕘 &nbsp;Jam : 11.00 WIB s/d
            <br />
            Selesai.
          </p>
        </motion.div>

      </div>
    </div>


    {/* ================= JUDUL LOKASI ================= */}
    <motion.div
      className="flex items-center justify-center gap-3 mt-12 mb-7"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="h-px w-10 md:w-20 bg-[#f6d58a]/70"></div>

      <h3 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
        Lokasi 🗺️
      </h3>

      <div className="h-px w-10 md:w-20 bg-[#f6d58a]/70"></div>
    </motion.div>


    {/* ================= GRID LOKASI ================= */}
    <div className="grid grid-cols-2 gap-4 md:gap-6 items-center">

      {/* MAP - TIDAK ADA ANIMASI */}
      <div
        className="
          rounded-xl
          overflow-hidden
          shadow-2xl
          border
          border-[#f6d58a]/40
        "
      >
        <iframe
          title="Rumah Mempelai Wanita"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.9882717260093!2d108.13788157681903!3d-7.355210072371376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f553fc27bf5d5%3A0x64cf2ad099f3702f!2sMASJID%20AL-IHSAN%20KAWUNGLUWUK%20SUKARAME!5e0!3m2!1sid!2sid!4v1786813794262!5m2!1sid!2sid"
          width="100%"
          height="200"
          allowFullScreen=""
          loading="lazy"
          className="w-full h-[170px] md:h-[200px] border-0"
        ></iframe>
      </div>


      {/* DESKRIPSI LOKASI - ANIMASI TEKS */}
      <motion.div
        className="text-left"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.15 }}
      >

        {/* ORNAMEN */}
        <motion.div
          className="text-[#f6d58a] text-xs mb-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          ✦ ── ❧
        </motion.div>


        {/* JUDUL */}
        <motion.h4
          className="text-base md:text-lg font-semibold mb-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Rumah Mempelai Wanita
        </motion.h4>


        {/* ALAMAT */}
        <motion.p
          className="text-xs md:text-sm text-white/80 mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          Kp KawungLuwuk,
          <br />
          Kec. Singaparna,
          <br />
          Kabupaten Tasikmalaya
        </motion.p>


        {/* BUTTON */}
        <motion.a
          href="https://maps.app.goo.gl/XKjXPgyMRUpy4HUE6"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            bg-[#f6d58a]
            text-black
            px-4
            py-2
            rounded-full
            text-xs
            font-semibold
            shadow-lg
          "
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true, amount: 0.15 }}
          whileHover={{
            scale: 1.03,
          }}
        >
          📍 Show location
        </motion.a>

      </motion.div>

    </div>


    {/* ================= ORNAMEN BAWAH ================= */}
    <motion.div
      className="flex items-center justify-center gap-3 mt-10"
      initial={{ opacity: 0, scaleX: 0.5 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="h-px w-16 md:w-28 bg-[#f6d58a]/60"></div>

      <span className="text-[#f6d58a] text-sm md:text-base">
        ✦ ❧ ♥ ❧ ✦
      </span>

      <div className="h-px w-16 md:w-28 bg-[#f6d58a]/60"></div>
    </motion.div>


    {/* ================= NOTE ================= */}
    <motion.div
      className="mt-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <blockquote className="text-sm md:text-base text-white/70 italic">
        "Semoga langkah kecil ini menjadi awal dari perjalanan panjang
        yang penuh cinta, doa, dan kebahagiaan." 🤍
      </blockquote>
    </motion.div>

  </div>
</section>

{/* SECTION 6 - LOVE STORY */}
<section
  className="
    relative
    w-full
    text-white
    py-20
    px-6
    md:px-20
    bg-center
    bg-cover
    overflow-hidden
    bg-scroll
    md:bg-fixed
  "
  style={{
    backgroundImage: "url('/love2.webp')",
  }}
>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/70"></div>

  <motion.div
    className="relative z-10 max-w-3xl mx-auto"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >

    {/* ================= JUDUL ================= */}
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Subtitle */}
      <motion.p
        className="text-[#f6d58a] text-xs tracking-[4px] mb-2"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        OUR JOURNEY
      </motion.p>

      {/* Judul */}
      <motion.h3
        className="text-2xl md:text-3xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Love Story 🎬
      </motion.h3>

      {/* Garis love */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-4"
        initial={{ opacity: 0, scaleX: 0.5 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        viewport={{ once: true }}
      >
        <div className="h-px w-14 md:w-24 bg-[#f6d58a]/70"></div>

        <span className="text-[#f6d58a] text-lg">
          ❧ ♥ ❧
        </span>

        <div className="h-px w-14 md:w-24 bg-[#f6d58a]/70"></div>
      </motion.div>
    </motion.div>


    {/* ================= EPISODE ================= */}
    <div className="space-y-8">

      {[
        {
          title: "Masa-masa",
          image: "/love1.webp",
          description:
            "Di antara kesibukan dan waktu yang terbatas, tanpa disadari tumbuh rasa yang membawa kami semakin dekat satu sama lain.",
        },
        {
          title: "Keseriusan",
          image: "/love2.webp",
          description:
            "Dalam waktu yang singkat, hubungan ini mulai dijalani dengan tulus, penuh keyakinan, dan disertai komitmen untuk saling menjaga serta melangkah bersama.",
        },
        {
          title: "Restu Keluarga",
          image: "/love3.webp",
          description:
            "Ketika hati telah menemukan keyakinannya, kami memilih melangkah dengan penuh ketulusan, memohon izin dan doa restu kedua orangtua untuk menyatukan dua hati dalam ikatan yang kami harapkan menjadi selamanya.",
        },
        {
          title: "The End of Beginning",
          image: "/love4.webp",
          description:
            "Pada akhirnya, kapal yang kami nahkodai mulai berlayar menuju tujuan yang sama. Dengan niat yang tulus, langkah ini pun terlaksana dalam balutan dukungan, doa, dan restu dari orang-orang tercinta. Semoga perjalanan ini menjadi awal dari kisah panjang yang kami jalani bersama, selamanya. 🤍",
        },
      ].map((episode, idx) => (

        <div key={idx}>

          {/* FOTO + JUDUL */}
          <div className="flex gap-4 items-start">

            {/* FOTO TIDAK DIANIMASI */}
            <div
              className="
                w-[90px]
                h-[120px]
                md:w-[110px]
                md:h-[145px]
                flex-shrink-0
                overflow-hidden
                rounded-lg
                border
                border-[#f6d58a]/40
                bg-black/40
                shadow-lg
              "
            >
              <img
                src={episode.image}
                alt={episode.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>


            {/* TEKS EPISODE */}
            <motion.div
              className="flex-1 min-w-0 pt-1"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.08,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >

              {/* Episode */}
              <motion.p
                className="text-[11px] md:text-xs text-[#f6d58a] mb-1"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08 + 0.1,
                }}
                viewport={{ once: true }}
              >
                Episode {idx + 1}:
              </motion.p>

              {/* Judul */}
              <motion.h4
                className="text-sm md:text-base font-semibold leading-tight"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.08 + 0.2,
                }}
                viewport={{ once: true }}
              >
                {episode.title}
              </motion.h4>

              {/* Ornamen */}
              <motion.div
                className="text-[#f6d58a]/70 text-xs mt-3"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08 + 0.3,
                }}
                viewport={{ once: true }}
              >
                ── ♥
              </motion.div>

            </motion.div>

          </div>


          {/* DESKRIPSI - ANIMASI SAJA */}
          <motion.p
            className="
              text-xs
              md:text-sm
              text-white/80
              leading-relaxed
              mt-4
            "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.08 + 0.25,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            {episode.description}
          </motion.p>


          {/* PEMISAH - ANIMASI */}
          {idx !== 3 && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-7"
              initial={{ opacity: 0, scaleX: 0.5 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08 + 0.3,
              }}
              viewport={{ once: true }}
            >
              <div className="h-px flex-1 bg-[#f6d58a]/30"></div>

              <span className="text-[#f6d58a]/80 text-xs">
                ❧ ♥ ❧
              </span>

              <div className="h-px flex-1 bg-[#f6d58a]/30"></div>
            </motion.div>
          )}

        </div>

      ))}

    </div>


    {/* ================= PENUTUP ================= */}
    <motion.div
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >

      <motion.div
        className="flex items-center justify-center gap-3 mb-5"
        initial={{ opacity: 0, scaleX: 0.5 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="h-px w-12 md:w-20 bg-[#f6d58a]/60"></div>

        <span className="text-[#f6d58a]">
          ✦ ♥ ✦
        </span>

        <div className="h-px w-12 md:w-20 bg-[#f6d58a]/60"></div>
      </motion.div>

      <motion.p
        className="text-sm md:text-base text-white/80 italic leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        viewport={{ once: true }}
      >
        "Bukan tentang bagaimana kita bertemu,
        <br />
        tetapi tentang bagaimana kita memilih untuk tetap bersama."
      </motion.p>

    </motion.div>

  </motion.div>
</section>


{/* SECTION 7 - MOMENT FAVORIT */}
<section
  className="
    relative
    w-full
    text-white
    py-20
    px-6
    md:px-20
    bg-center
    bg-cover
    overflow-hidden
    bg-scroll
    md:bg-fixed
  "
  style={{
    backgroundImage: "url('/love2.webp')",
  }}
>
  {/* OVERLAY BACKGROUND */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* ORNAMEN - hanya desktop */}
  <div className="hidden md:block absolute top-10 left-10 text-yellow-400/10 text-7xl">
    ♡
  </div>

  <div className="hidden md:block absolute bottom-10 right-10 text-yellow-400/10 text-7xl">
    ♡
  </div>


  <motion.div
    className="relative z-10 max-w-6xl mx-auto"
    initial={{
      opacity: 0,
      y: 20,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.5,
    }}
    viewport={{
      once: true,
      amount: 0.1,
    }}
  >

    {/* ================= JUDUL ================= */}
    <div className="text-center mb-10">

      <h3 className="text-2xl md:text-3xl font-bold">
        Moment Favorit 📸
      </h3>

      {/* GARIS LOVE */}
      <div className="flex items-center justify-center gap-3 mt-4">

        <div className="w-16 md:w-24 h-px bg-yellow-400/70"></div>

        <span className="text-yellow-400 text-lg">
          ♥
        </span>

        <div className="w-16 md:w-24 h-px bg-yellow-400/70"></div>

      </div>

      <p className="text-xs md:text-sm text-white/70 mt-4 italic">
        "Beberapa momen mungkin sederhana, tetapi selalu memiliki cerita yang istimewa."
      </p>

    </div>


    {/* ================= GRID FOTO ================= */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">

      {[
        { img: "/pre1.webp" },
        { img: "/pre2.webp" },
        { img: "/pre3.webp" },
        { img: "/pre4.webp" },
        { img: "/pre5.webp" },
        { img: "/pre6.webp" },
      ].map((item, idx) => (

        <motion.div
          key={idx}
          className="
            relative
            rounded-xl
            overflow-hidden
            shadow-lg
            cursor-pointer
            border
            border-white/20
            bg-black/20
          "

          initial={{
            opacity: 0,
            y: 15,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: idx * 0.04,
            duration: 0.3,
          }}

          viewport={{
            once: true,
            amount: 0.1,
          }}

          onClick={() => setSelectedImage(item.img)}
        >

          {/* FOTO */}
          <img
            src={item.img}
            alt={`Moment ${idx + 1}`}
            loading="lazy"
            decoding="async"
            className="
              block
              w-full
              aspect-[3/4]
              object-cover
            "
          />

          {/* LOVE STATIC */}
          <span
            className="
              absolute
              top-2
              right-2
              text-yellow-400
              text-lg
              drop-shadow-md
            "
          >
            ♥
          </span>

        </motion.div>

      ))}

    </div>


    {/* ================= KETERANGAN ================= */}
    <motion.div
      className="text-center mt-10"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      viewport={{
        once: true,
      }}
    >

      <div className="flex items-center justify-center gap-3 mb-4">

        <span className="text-yellow-400">
          ✦
        </span>

        <div className="w-20 h-px bg-yellow-400/50"></div>

        <span className="text-yellow-400 text-xl">
          ♡
        </span>

        <div className="w-20 h-px bg-yellow-400/50"></div>

        <span className="text-yellow-400">
          ✦
        </span>

      </div>

      <p className="text-xs md:text-sm text-white/70 italic">
        Setiap cerita menyimpan rasa, dan setiap momen menjadi bagian
        dari perjalanan cinta kita. 🤍
      </p>

    </motion.div>


    {/* ================= MODAL FOTO ================= */}
    {selectedImage && (
      <div
        className="
          fixed
          inset-0
          z-[9999]
          bg-black/95
          flex
          items-center
          justify-center
          p-4
        "
        onClick={() => setSelectedImage(null)}
      >

        {/* FOTO BESAR */}
        <img
          src={selectedImage}
          alt="Preview Moment"
          className="
            max-w-full
            max-h-[90vh]
            object-contain
            rounded-xl
            shadow-2xl
            border
            border-white/20
          "
          onClick={(e) => e.stopPropagation()}
        />

        {/* TOMBOL CLOSE */}
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="
            absolute
            top-5
            right-5
            w-11
            h-11
            rounded-full
            bg-black/60
            border
            border-white/30
            text-white
            text-2xl
            transition
          "
        >
          ×
        </button>

      </div>
    )}

  </motion.div>
</section>
{/* SECTION 9 - WEDDING GIFT */}
<section
  className="relative w-full text-white py-20 px-6 md:px-20 bg-center bg-cover overflow-hidden
             bg-scroll md:bg-fixed"
  style={{ backgroundImage: "url('/love2.webp')" }}
>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/70"></div>

  {/* ORNAMEN BACKGROUND */}
  <div className="absolute top-10 left-5 text-yellow-400/20 text-7xl">
    ♡
  </div>

  <div className="absolute top-32 right-5 text-yellow-400/20 text-6xl">
    ✦
  </div>

  <div className="absolute bottom-10 left-10 text-yellow-400/20 text-5xl">
    ✦
  </div>

  <div className="absolute bottom-20 right-8 text-yellow-400/20 text-7xl">
    ♡
  </div>

  <motion.div
    className="relative z-10 max-w-xl mx-auto text-center"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >

    {/* JUDUL */}
    <div className="mb-7">

      <h3 className="text-3xl md:text-4xl font-serif tracking-wide">
        Wedding Gift
      </h3>

      {/* GARIS LOVE */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="w-16 h-px bg-yellow-400/70"></div>

        <span className="text-yellow-400 text-xl animate-pulse">
          ♥
        </span>

        <div className="w-16 h-px bg-yellow-400/70"></div>
      </div>

    </div>

    {/* DESKRIPSI */}
    <p className="text-sm md:text-base leading-relaxed mb-8 text-white/90">
      Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
      Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
      memberi kado secara cashless.
    </p>

    {/* CARD UTAMA */}
    <div
      className="
        relative
        rounded-[28px]
        border
        border-yellow-400/40
        bg-[#1b2330]/95
        px-6
        py-8
        md:px-10
        shadow-2xl
        backdrop-blur-md
        overflow-hidden
      "
    >

      {/* ORNAMEN CARD */}
      <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-yellow-400/10 blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-pink-400/10 blur-2xl"></div>

      {/* CORNER ORNAMENT */}
      <div className="absolute top-4 left-4 text-yellow-400/60 text-xl">
        ✦
      </div>

      <div className="absolute top-4 right-4 text-yellow-400/60 text-xl">
        ✦
      </div>

      {/* ================= BCA ================= */}
      <div className="relative flex flex-col items-center">

        <div className="text-3xl font-extrabold tracking-widest text-[#168df5]">
          BCA
        </div>

        <div className="w-12 h-px bg-yellow-400/50 my-2"></div>

        <p className="text-xl font-semibold tracking-wider">
          3211250109
        </p>

        <p className="text-base text-white/80 mb-3">
          a/n Nazah Auliana
        </p>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText("3211250109")
          }
          className="
            w-full
            max-w-xs
            bg-red-700
            hover:bg-yellow-500
            hover:text-black
            text-white
            py-2.5
            rounded-lg
            font-semibold
            tracking-widest
            shadow-lg
            transition
            duration-300
          "
        >
          📋 SALIN / COPY
        </button>

      </div>

      {/* PEMISAH */}
      <div className="flex items-center gap-3 my-7 text-gray-400">

        <span className="h-px bg-yellow-400/30 flex-1"></span>

        <span className="font-serif text-yellow-400">
          ♡ Atau ♡
        </span>

        <span className="h-px bg-yellow-400/30 flex-1"></span>

      </div>

      {/* ================= DANA ================= */}
      <div className="relative flex flex-col items-center">

        <div className="text-3xl font-extrabold tracking-widest text-[#168df5]">
          DANA
        </div>

        <div className="w-12 h-px bg-yellow-400/50 my-2"></div>

        <p className="text-xl font-semibold tracking-wider mt-2">
          0895327321531
        </p>

        <p className="text-base text-white/80 mb-3">
          a/n Nazah Auliana
        </p>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText("0895327321531")
          }
          className="
            w-full
            max-w-xs
            bg-red-700
            hover:bg-yellow-500
            hover:text-black
            text-white
            py-2.5
            rounded-lg
            font-semibold
            tracking-widest
            shadow-lg
            transition
            duration-300
          "
        >
          📋 SALIN / COPY
        </button>

      </div>

      {/* PEMISAH */}
      <div className="flex items-center gap-3 my-7 text-gray-400">

        <span className="h-px bg-yellow-400/30 flex-1"></span>

        <span className="font-serif text-yellow-400">
          ♡ Atau ♡
        </span>

        <span className="h-px bg-yellow-400/30 flex-1"></span>

      </div>

      {/* ================= QRIS ================= */}
      <div className="relative flex flex-col items-center">

        <div className="text-3xl font-extrabold tracking-widest text-[#168df5]">
          QRIS
        </div>

        <div className="w-12 h-px bg-yellow-400/50 my-2 mb-5"></div>

        {/* FRAME QRIS */}
        <motion.div
          className="
            p-2
            rounded-2xl
            bg-white
            border-2
            border-yellow-400
            shadow-[0_0_25px_rgba(250,204,21,0.25)]
            cursor-pointer
          "
          whileHover={{
            scale: 1.06,
          }}
          transition={{ duration: 0.3 }}
          onClick={() => setSelectedQRIS("/qris.jpeg")}
        >
          <img
            src="/qris.jpeg"
            alt="QRIS"
            className="
              w-32
              h-32
              object-cover
              rounded-xl
            "
          />
        </motion.div>

        {/* PETUNJUK */}
        <motion.p
          className="
            text-lg
            font-semibold
            italic
            tracking-wide
            mt-5
            text-yellow-300
          "
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          " Klik dulu baru ss "
        </motion.p>

        <p className="text-xs text-white/50 mt-2">
          Klik QRIS untuk memperbesar
        </p>

      </div>

      {/* ORNAMEN BAWAH CARD */}
      <div className="flex items-center justify-center gap-3 mt-8">

        <span className="text-yellow-400/70">
          ✦
        </span>

        <div className="w-14 h-px bg-yellow-400/30"></div>

        <span className="text-yellow-400">
          ♥
        </span>

        <div className="w-14 h-px bg-yellow-400/30"></div>

        <span className="text-yellow-400/70">
          ✦
        </span>

      </div>

    </div>

    {/* KALIMAT PENUTUP */}
    <motion.p
      className="mt-7 text-sm text-white/70 italic"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      "Terima kasih atas doa, kasih, dan perhatian yang diberikan kepada kami." 🤍
    </motion.p>

  </motion.div>


  {/* ================= MODAL QRIS ================= */}
  {selectedQRIS && (
    <motion.div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/95
        flex
        items-center
        justify-center
        p-4
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedQRIS(null)}
    >

      <motion.img
        src={selectedQRIS}
        alt="QRIS Preview"
        className="
          max-w-[90vw]
          max-h-[90vh]
          object-contain
          rounded-xl
          shadow-2xl
          border
          border-yellow-400/50
        "
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        onClick={() => setSelectedQRIS(null)}
        className="
          absolute
          top-5
          right-5
          w-12
          h-12
          rounded-full
          bg-white/10
          hover:bg-yellow-400
          hover:text-black
          text-white
          text-3xl
          transition
          border
          border-white/20
        "
      >
        ×
      </button>

    </motion.div>
  )}

</section>
{/* SECTION 10 - WISH FOR THE COUPLE */}
<section
  className="relative w-full text-white py-20 px-6 md:px-20 bg-center bg-cover overflow-hidden
             bg-scroll md:bg-fixed"
  style={{ backgroundImage: "url('/love2.webp')" }}
>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/70"></div>

  {/* ORNAMEN ATAS */}
  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-yellow-300/80 text-2xl">
    ♡
  </div>

  {/* ISI */}
  <motion.div
    className="relative z-10 max-w-2xl mx-auto"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.15 }}
  >

    {/* JUDUL */}
    <div className="text-center mb-8">

      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-16 h-px bg-yellow-300/70"></span>
        <span className="text-yellow-300 text-lg">♥</span>
        <span className="w-16 h-px bg-yellow-300/70"></span>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold tracking-wide">
        Wish For The Couple
      </h3>

      <p className="text-sm text-white/70 mt-2 italic">
        Tinggalkan ucapan dan doa terbaik untuk kami
      </p>

      <div className="flex items-center justify-center gap-3 mt-3">
        <span className="w-10 h-px bg-yellow-300/50"></span>
        <span className="text-yellow-300/80">♡</span>
        <span className="w-10 h-px bg-yellow-300/50"></span>
      </div>
    </div>

    {/* FORM CARD */}
    <div className="bg-black/45 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-7 shadow-2xl">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!guestName || !wishInput.trim()) return;
          handleSubmitWish();
        }}
        className="flex flex-col gap-4"
      >

        {/* NAMA */}
        <input
          type="text"
          placeholder="Nama kamu"
          className="px-4 py-3 rounded-xl bg-gray-900/80 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />

        {/* UCAPAN */}
        <textarea
          placeholder="Ucapan atau doa kamu..."
          className="px-4 py-3 rounded-xl bg-gray-900/80 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition resize-none"
          rows={4}
          value={wishInput}
          onChange={(e) => setWishInput(e.target.value)}
          required
        />

        {/* BUTTON */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white font-semibold shadow-lg transition"
        >
          💌 Kirim Ucapan
        </motion.button>
      </form>

      {/* GARIS */}
      <div className="flex items-center gap-3 my-7">
        <span className="h-px bg-white/20 flex-1"></span>
        <span className="text-yellow-300 text-lg">♥</span>
        <span className="h-px bg-white/20 flex-1"></span>
      </div>

      {/* RECENT WISHES */}
      <div>
        <h4 className="text-center text-lg font-semibold mb-5">
          Ucapan & Doa 💐
        </h4>

        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">

          {wishes.map((wish, i) => (
            <motion.div
              key={wish.id || `wish-${i}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true, amount: 0.15 }}
              className="relative bg-gray-900/75 backdrop-blur-sm px-5 py-4 rounded-xl border border-white/10 shadow-lg"
            >

              {/* Hiasan hati kecil */}
              <span className="absolute top-3 right-4 text-yellow-300/60 text-sm">
                ♥
              </span>

              <p className="text-sm text-gray-300">
                Dari:{" "}
                <span className="font-semibold text-white">
                  {wish.name}
                </span>
              </p>

              <p className="mt-2 text-base text-white/90 italic leading-relaxed">
                “{wish.message}”
              </p>

            </motion.div>
          ))}

        </div>
      </div>
    </div>

    {/* KATA PENUTUP */}
    <motion.div
      className="text-center mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="w-12 h-px bg-yellow-300/50"></span>
        <span className="text-yellow-300 text-xl">♡</span>
        <span className="w-12 h-px bg-yellow-300/50"></span>
      </div>

      <p className="mt-3 text-sm text-white/70 italic">
        Terima kasih atas doa dan ucapan terbaiknya 🤍
      </p>
    </motion.div>

  </motion.div>
</section>

{/* section 11 penutup */}
<section
  className="relative w-full text-white py-20 px-6 md:px-20 bg-center bg-cover overflow-hidden
             bg-scroll md:bg-fixed"
  style={{ backgroundImage: "url('/love2.webp')" }} // ganti dengan file final
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/70 z-0" />

  {/* Konten */}
  <motion.div
    className="relative z-10 max-w-xl mx-auto text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    <h3 className="text-2xl md:text-3xl font-bold mb-6">Sampai Jumpa di Hari Bahagia Kami 🌟</h3>
    <p className="text-sm md:text-base text-white/90 leading-relaxed">
      Terima kasih telah menjadi bagian dari cerita cinta kami. <br />
      Dengan penuh rasa syukur, kami menantikan kehadiranmu di hari yang sangat berarti ini.
    </p>
    <p className="mt-6 italic text-xs text-white/60">
      “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berfikir.” <br />
      – (Q.S. Ar-Rum: 21)
    </p>
  </motion.div>
</section>












        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 5 }}
            transition={{ duration: 1 }}
          >
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30 blur-sm animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
            <motion.h1
              className="text-8xl lg:text-8xl font-bold text-red-600 z-10 font-bebas"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              NIKFLIX
            </motion.h1>
            <audio
              ref={audioRefIntro}
              src="/sound/netflix_sound.mp3"
              preload="auto"
            />
              {introFinished && (
              <motion.button
                onClick={scrollToHero}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full text-2xl z-50 shadow-xl"
              >
                <FaPlay />
              </motion.button>
            )}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 text-white text-xl z-10"
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>






      {/* CSS */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-fadeOut {
        opacity: 0;
        transition: opacity 1s ease-out;
        }
        @keyframes roll {
        0% { top: 100%; }
        100% { top: -150%; }
        }
        .animate-roll {
        animation: roll 25s linear infinite;
         }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
    /* styles/global.css atau di tailwind layer base */
body::-webkit-scrollbar {
  width: 0.4em;
}
body::-webkit-scrollbar-track {
  background: transparent;
}
body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
      
      `}</style>
    </div>
  );
}