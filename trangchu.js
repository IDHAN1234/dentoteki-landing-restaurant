// Danh sách ID của các trang HERO (chỉ 3 trang này trượt ngang)
const heroPages = [
    'hero-one', 
    'hero-two', 
    'hero-three', 
];
const totalHeroPages = heroPages.length;
let currentHeroIndex = 0;
let heroSlider;

// Hàm trượt Hero (dùng cho nút mũi tên và cuộn chuột)
function scrollToPage(direction) {
    let nextIndex = currentHeroIndex;

    if (direction === 'next' && currentHeroIndex < totalHeroPages - 1) {
        nextIndex++;
    } else if (direction === 'previous' && currentHeroIndex > 0) {
        nextIndex--;
    } else if (direction === 'next' && currentHeroIndex === totalHeroPages - 1) {
        document.getElementById('gioi-thieu-chung').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return; 
    } else {
        return; 
    }
    
    currentHeroIndex = nextIndex;

    const offset = currentHeroIndex * -100; 
    heroSlider.style.transform = `translateX(${offset}vw)`;
    
    updateVideoBackground();
}

// Hàm được gọi từ HTML
function goToNextPage() {
    scrollToPage('next');
}

function goToPreviousPage() {
    scrollToPage('previous');
}

// Cập nhật trạng thái phát/tạm dừng của video nền
function updateVideoBackground() {
    const allHeroVideos = document.querySelectorAll('#hero-slider .hero-video-bg');
    allHeroVideos.forEach((video, index) => {
        if (index === currentHeroIndex) {
            video.style.display = 'block';
            video.play();
        } else {
            video.style.display = 'none';
            video.pause();
        }
    });
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    heroSlider = document.getElementById('hero-slider');
    
    currentHeroIndex = 0;
    updateVideoBackground();
    
    window.addEventListener('wheel', (e) => {
        const heroSliderRect = heroSlider.getBoundingClientRect();
        
        if (heroSliderRect.top > window.innerHeight || heroSliderRect.bottom < 0) {
            return;
        }

        
        // Xử lý cuộn ngang (trên trackpad hoặc magic mouse)
        if (Math.abs(e.deltaX) > 10) {
            e.preventDefault(); 
            scrollToPage(e.deltaX > 0 ? 'next' : 'previous');
        } 
        // Xử lý cuộn dọc khi đang ở Hero slider
        else if (Math.abs(e.deltaY) > 20) {
            if (e.deltaY > 0) {
                if (currentHeroIndex === totalHeroPages - 1) {
                    return; 
                } else {
                    e.preventDefault(); 
                    scrollToPage('next');
                }
            } 
            else { 
                if (currentHeroIndex === 0) {
                    return; 
                } else {
                    e.preventDefault(); 
                    scrollToPage('previous');
                }
            }
        }
    }, { passive: false });
});