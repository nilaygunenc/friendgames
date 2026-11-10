// Mock data for development without database
// TODO: Remove when database is integrated

export interface Game {
    id: string;
    name: string;
    icon: string;
    category: string;
    category_label: string;
    min_players: number;
    max_players: number;
    min_time: number;
    max_time: number;
    description: string;
    is_vip: boolean;
    engine: string;
    rules: string[];
    badges: string[];
}

export interface User {
    id: string;
    email: string;
    password_hash: string;
    display_name: string;
    is_vip: boolean;
    vip_expires_at: string | null;
    created_at: string;
}

export interface Question {
    id: string;
    game_pool: string;
    content: string;
    is_active: boolean;
}

export interface TabuCard {
    id: string;
    main_word: string;
    banned_words: string[];
    is_active: boolean;
}

// Mock Games Database
export const mockGames: Game[] = [
    {
        id: '1',
        name: 'Kim Daha Çok?',
        icon: '🤔',
        category: 'buz-kirici',
        category_label: 'Buz Kırıcı',
        min_players: 2,
        max_players: 20,
        min_time: 10,
        max_time: 30,
        description: 'Grupta kim daha çok... sorularıyla birbirinizi tanıyın!',
        is_vip: false,
        engine: 'question',
        rules: [
            'Soru okunur ve herkes aynı anda tahmin ettiği kişiye işaret eder',
            'En çok işaret edilen kişi kazanır',
            'Eşitlik varsa hepsi kazanır'
        ],
        badges: ['Popüler', 'Kolay', 'Hızlı']
    },
    {
        id: '2',
        name: 'Ne Zaman?',
        icon: '📅',
        category: 'buz-kirici',
        category_label: 'Buz Kırıcı',
        min_players: 2,
        max_players: 20,
        min_time: 10,
        max_time: 30,
        description: 'Kişiler hakkında ne zaman sorularıyla tahmin yürütün!',
        is_vip: false,
        engine: 'question',
        rules: [
            'Soru okunur ve tahmin edilen kişi seçilir',
            'Kişi gerçek cevabı söyler',
            'En yakın tahminde bulunan kazanır'
        ],
        badges: ['Eğlenceli', 'Orta']
    },
    {
        id: '3',
        name: 'Tabu',
        icon: '🚫',
        category: 'kelime',
        category_label: 'Kelime Oyunu',
        min_players: 4,
        max_players: 20,
        min_time: 20,
        max_time: 60,
        description: 'Yasaklı kelimeleri kullanmadan kelimeyi anlat!',
        is_vip: true,
        engine: 'tabu',
        rules: [
            'Kartı çeken kişi yasaklı kelimeler hariç kelimeyi anlatır',
            '60 saniye içinde doğru tahmin edilirse puan',
            'Yasaklı kelime kullanılırsa pas',
            'En çok puan toplayan takım kazanır'
        ],
        badges: ['VIP', 'Zor', 'Takım']
    },
    {
        id: '4',
        name: 'Vampir Köy',
        icon: '🧛',
        category: 'gizli-rol',
        category_label: 'Gizli Rol',
        min_players: 5,
        max_players: 15,
        min_time: 15,
        max_time: 45,
        description: 'Vampirleri bul, köyü kurtar! Gizli rol oyunu.',
        is_vip: true,
        engine: 'vampir',
        rules: [
            'Her oyuncuya gizli bir rol verilir',
            'Gece vampirler bir köylüyü öldürür',
            'Gündüz köylüler bir kişiyi oylar',
            'Vampirler veya köylüler kazanır'
        ],
        badges: ['VIP', 'Strateji', 'Gizli Rol']
    },
    {
        id: '5',
        name: 'Herkes İçin',
        icon: '🌟',
        category: 'buz-kirici',
        category_label: 'Buz Kırıcı',
        min_players: 3,
        max_players: 20,
        min_time: 10,
        max_time: 30,
        description: 'Sırayla sorular, herkes cevap verir!',
        is_vip: false,
        engine: 'everyone',
        rules: [
            'Soru okunur',
            'Herkes sırayla cevap verir',
            'Cevap vermeyenler elenir',
            'Son kalan kazanır'
        ],
        badges: ['Eğlenceli', 'Kolay']
    },
    {
        id: '6',
        name: 'Parmaklar',
        icon: '✋',
        category: 'friendgames',
        category_label: 'FriendGames Özel',
        min_players: 3,
        max_players: 10,
        min_time: 5,
        max_time: 15,
        description: 'Tahmin et kaç parmak havaya kalkacak!',
        is_vip: false,
        engine: 'fingers',
        rules: [
            'Lider bir sayı söyler',
            'Herkes aynı anda 0-5 parmak gösterir',
            'Toplam liderın söylediği sayıya eşitse lider kazanır',
            'Eşit değilse lider elenir'
        ],
        badges: ['Hızlı', 'Tahmin']
    },
    {
        id: '7',
        name: 'Ajan Kim?',
        icon: '🕵️',
        category: 'gizli-rol',
        category_label: 'Gizli Rol',
        min_players: 3,
        max_players: 10,
        min_time: 10,
        max_time: 20,
        description: 'Ajanı bul! Herkes lokasyonu biliyor, ajan bilmiyor.',
        is_vip: false,
        engine: 'agent',
        rules: [
            'Herkes lokasyonu görür, ajan görmez',
            'Sırayla lokasyon hakkında ipucu verilir',
            'Ajanı bulmaya çalışın',
            'Ajan lokasyonu tahmin etmeye çalışır'
        ],
        badges: ['Gizli Rol', 'Orta']
    },
    {
        id: '8',
        name: 'Mime',
        icon: '🎭',
        category: 'kelime',
        category_label: 'Kelime Oyunu',
        min_players: 4,
        max_players: 20,
        min_time: 15,
        max_time: 45,
        description: 'Sessiz anlat, tahmin et!',
        is_vip: false,
        engine: 'mime',
        rules: [
            'Oyuncu kartı çeker ve sessizce anlatır',
            'Takım arkadaşları tahmin eder',
            '60 saniye süre',
            'En çok doğru tahmin eden takım kazanır'
        ],
        badges: ['Aktif', 'Takım']
    },
    {
        id: '9',
        name: 'Müzayede',
        icon: '⚖️',
        category: 'friendgames',
        category_label: 'FriendGames Özel',
        min_players: 3,
        max_players: 10,
        min_time: 15,
        max_time: 30,
        description: 'Soruları müzayedede sat ve al!',
        is_vip: true,
        engine: 'auction',
        rules: [
            'Her oyuncu başlangıç parası alır',
            'Sorular müzayedede satılır',
            'Soruyu alan cevap verir',
            'Doğru cevapta puan, yanlışta ceza'
        ],
        badges: ['VIP', 'Strateji', 'Eğlenceli']
    },
    {
        id: '10',
        name: 'Hukuk Davası',
        icon: '⚖️',
        category: 'friendgames',
        category_label: 'FriendGames Özel',
        min_players: 4,
        max_players: 12,
        min_time: 20,
        max_time: 60,
        description: 'Savcı ve avukatlar düelloya! Jüri karar verir.',
        is_vip: true,
        engine: 'legal',
        rules: [
            'Rastgele bir suçlama seçilir',
            'Savcı suçlamayı savunur',
            'Avukat müvekkili savunur',
            'Jüri oylama ile karar verir'
        ],
        badges: ['VIP', 'Rol Yapma', 'Zor']
    },
    {
        id: '11',
        name: 'Mafia Lite',
        icon: '🎩',
        category: 'gizli-rol',
        category_label: 'Gizli Rol',
        min_players: 5,
        max_players: 12,
        min_time: 15,
        max_time: 45,
        description: 'Basitleştirilmiş mafia oyunu. Mafyayı bul!',
        is_vip: false,
        engine: 'mafia-lite',
        rules: [
            'Roller gizli dağıtılır',
            'Gece mafya bir kişiyi öldürür',
            'Gündüz köylüler oylama yapar',
            'Mafyaları bul veya mafya kazanır'
        ],
        badges: ['Gizli Rol', 'Orta']
    },
    {
        id: '12',
        name: 'Gizem Hikayesi',
        icon: '🔍',
        category: 'friendgames',
        category_label: 'FriendGames Özel',
        min_players: 3,
        max_players: 10,
        min_time: 20,
        max_time: 60,
        description: 'Cinayet gizemi! İpuçlarını topla, suçluyu bul.',
        is_vip: true,
        engine: 'mystery',
        rules: [
            'Bir cinayet vakası anlatılır',
            'Oyuncular soru sorarak ipucu toplar',
            'Sadece evet/hayır soruları sorulabilir',
            'İlk çözen kazanır'
        ],
        badges: ['VIP', 'Dedektif', 'Zor']
    }
];

// Mock Users Database
export const mockUsers: User[] = [];

// Mock Questions
export const mockQuestions: Question[] = [
    { id: '1', game_pool: 'kim-daha-cok', content: 'Kim daha çok geç kalır?', is_active: true },
    { id: '2', game_pool: 'kim-daha-cok', content: 'Kim daha çok yemek yer?', is_active: true },
    { id: '3', game_pool: 'kim-daha-cok', content: 'Kim daha çok konuşur?', is_active: true },
    { id: '4', game_pool: 'kim-daha-cok', content: 'Kim daha çok şarkı söyler?', is_active: true },
    { id: '5', game_pool: 'kim-daha-cok', content: 'Kim daha çok sosyal medyada takılır?', is_active: true },
    { id: '6', game_pool: 'ne-zaman', content: 'Ne zaman ilk öpüştü?', is_active: true },
    { id: '7', game_pool: 'ne-zaman', content: 'Ne zaman son kez ağladı?', is_active: true },
    { id: '8', game_pool: 'ne-zaman', content: 'Ne zaman en utanç verici anını yaşadı?', is_active: true },
    { id: '9', game_pool: 'herkes-icin', content: 'En sevdiğin yemek nedir?', is_active: true },
    { id: '10', game_pool: 'herkes-icin', content: 'Hayalindeki tatil nerede?', is_active: true },
    { id: '11', game_pool: 'herkes-icin', content: 'En sevdiğin film hangisi?', is_active: true }
];

// Mock Tabu Cards
export const mockTabuCards: TabuCard[] = [
    {
        id: '1',
        main_word: 'Telefon',
        banned_words: ['Aramak', 'Cep', 'Mobil', 'iPhone', 'Samsung'],
        is_active: true
    },
    {
        id: '2',
        main_word: 'Futbol',
        banned_words: ['Top', 'Gol', 'Oyun', 'Maç', 'Takım'],
        is_active: true
    },
    {
        id: '3',
        main_word: 'Kahve',
        banned_words: ['İçecek', 'Starbucks', 'Kahvaltı', 'Türk', 'Sıcak'],
        is_active: true
    },
    {
        id: '4',
        main_word: 'Kitap',
        banned_words: ['Okumak', 'Sayfa', 'Yazar', 'Roman', 'Kütüphane'],
        is_active: true
    },
    {
        id: '5',
        main_word: 'Araba',
        banned_words: ['Sürücü', 'Motor', 'Tekerlek', 'Yol', 'Benzin'],
        is_active: true
    },
    {
        id: '6',
        main_word: 'Plaj',
        banned_words: ['Deniz', 'Kum', 'Güneş', 'Tatil', 'Yüzmek'],
        is_active: true
    }
];

// Mock Favorites (in-memory storage)
export const mockFavorites: { userId: string; gameId: string }[] = [];

// Helper functions
export function findUserByEmail(email: string): User | undefined {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
    return mockUsers.find(u => u.id === id);
}

export function createUser(email: string, passwordHash: string, displayName: string): User {
    const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        display_name: displayName,
        is_vip: false,
        vip_expires_at: null,
        created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
}

export function updateUserVip(userId: string, isVip: boolean, expiresAt: Date | null): void {
    const user = findUserById(userId);
    if (user) {
        user.is_vip = isVip;
        user.vip_expires_at = expiresAt ? expiresAt.toISOString() : null;
    }
}

export function getUserFavorites(userId: string): Game[] {
    const favoriteIds = mockFavorites
        .filter(f => f.userId === userId)
        .map(f => f.gameId);
    return mockGames.filter(g => favoriteIds.includes(g.id));
}

export function toggleUserFavorite(userId: string, gameId: string): boolean {
    const index = mockFavorites.findIndex(
        f => f.userId === userId && f.gameId === gameId
    );
    if (index >= 0) {
        mockFavorites.splice(index, 1);
        return false;
    } else {
        mockFavorites.push({ userId, gameId });
        return true;
    }
}
