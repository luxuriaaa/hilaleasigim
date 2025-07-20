// Güvenlik fonksiyonları
class SecurityManager {
  private static instance: SecurityManager;
  private authToken: string | null = null;
  private sessionStartTime: number = 0;
  private failedAttempts: number = 0;
  private lastAttemptTime: number = 0;
  private isLocked: boolean = false;
  private lockUntil: number = 0;

  private constructor() {}

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Şifreyi hash'le (basit obfuscation)
  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit integer'a çevir
    }
    return Math.abs(hash).toString(16);
  }

  // Rate limiting kontrolü
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Eğer kilitliyse ve süre dolmadıysa
    if (this.isLocked && now < this.lockUntil) {
      return false;
    }
    
    // Kilit süresi dolduysa kilidi kaldır
    if (this.isLocked && now >= this.lockUntil) {
      this.isLocked = false;
      this.failedAttempts = 0;
    }

    return true;
  }

  // Şifre doğrulama
  authenticate(password: string): { success: boolean; message: string; lockTime?: number } {
    if (!this.checkRateLimit()) {
      const remainingTime = Math.ceil((this.lockUntil - Date.now()) / 1000);
      return { 
        success: false, 
        message: `Too many failed attempts. Try again in ${remainingTime} seconds.`,
        lockTime: remainingTime
      };
    }

    const now = Date.now();
    const correctHash = this.hashPassword('popeyes');
    const inputHash = this.hashPassword(password.toLowerCase().trim());

    if (inputHash === correctHash) {
      // Başarılı giriş
      this.authToken = this.generateToken();
      this.sessionStartTime = now;
      this.failedAttempts = 0;
      this.isLocked = false;
      
      // Session storage'a güvenli token kaydet
      sessionStorage.setItem('auth_token', this.authToken);
      sessionStorage.setItem('auth_time', now.toString());
      
      return { success: true, message: 'Authentication successful' };
    } else {
      // Başarısız giriş
      this.failedAttempts++;
      this.lastAttemptTime = now;

      // 3 başarısız denemeden sonra 30 saniye kilitle
      if (this.failedAttempts >= 3) {
        this.isLocked = true;
        this.lockUntil = now + 30000; // 30 saniye
        return { 
          success: false, 
          message: 'Too many failed attempts. Locked for 30 seconds.',
          lockTime: 30
        };
      }

      return { 
        success: false, 
        message: `Invalid password. ${3 - this.failedAttempts} attempts remaining.`
      };
    }
  }

  // Token oluştur
  private generateToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}_${random}`).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Session doğrulama
  isValidSession(): boolean {
    const storedToken = sessionStorage.getItem('auth_token');
    const storedTime = sessionStorage.getItem('auth_time');
    
    if (!storedToken || !storedTime || storedToken !== this.authToken) {
      return false;
    }

    const sessionAge = Date.now() - parseInt(storedTime);
    const maxSessionTime = 30 * 60 * 1000; // 30 dakika

    if (sessionAge > maxSessionTime) {
      this.logout();
      return false;
    }

    return true;
  }

  // Çıkış
  logout(): void {
    this.authToken = null;
    this.sessionStartTime = 0;
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_time');
  }

  // Developer tools algılama
  detectDevTools(): boolean {
    const threshold = 160;
    return (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    );
  }

  // Console temizleme
  clearConsole(): void {
    if (typeof console.clear === 'function') {
      console.clear();
    }
  }

  // Anti-debug
  startAntiDebug(): void {
    // Console açılırsa uyarı ver
    setInterval(() => {
      if (this.detectDevTools()) {
        console.clear();
        console.log('%cAccess Denied!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cThis site is protected.', 'color: red; font-size: 20px;');
      }
    }, 1000);

    // F12, Ctrl+Shift+I, Ctrl+U engellemeler
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        console.clear();
        console.log('%cNice try! 😏', 'color: pink; font-size: 30px;');
      }
    });
  }
}

export default SecurityManager;