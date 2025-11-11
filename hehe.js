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
        // Nếu ở cuối Hero slider và cuộn tiếp, cuộn xuống Giới thiệu chung
        document.getElementById('gioi-thieu-chung').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return; // Dừng hàm, không trượt ngang nữa
    } else {
        return; // Dừng hàm nếu không có gì để trượt
    }
    
    currentHeroIndex = nextIndex;

    // Áp dụng transform để trượt ngang container Hero
    const offset = currentHeroIndex * -100; // -100% cho mỗi slide
    heroSlider.style.transform = `translateX(${offset}vw)`;
    
    // Cập nhật trạng thái hiển thị và phát của video nền
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
    
    // Khởi tạo ở trang Hero đầu tiên và cập nhật video
    currentHeroIndex = 0;
    updateVideoBackground();
    
    // Thêm lắng nghe sự kiện cuộn chuột để điều hướng Hero slider
    window.addEventListener('wheel', (e) => {
        const heroSliderRect = heroSlider.getBoundingClientRect();
        
        // Kiểm tra xem Hero Slider có đang nằm trong viewport chính không
        if (heroSliderRect.top > window.innerHeight || heroSliderRect.bottom < 0) {
            return;
        }

        // Nếu người dùng đang cuộn trong khu vực Hero slider
        
        // Xử lý cuộn ngang (trên trackpad hoặc magic mouse)
        if (Math.abs(e.deltaX) > 10) {
            e.preventDefault(); 
            scrollToPage(e.deltaX > 0 ? 'next' : 'previous');
        } 
        // Xử lý cuộn dọc khi đang ở Hero slider
        else if (Math.abs(e.deltaY) > 20) {
            // Cuộn xuống
            if (e.deltaY > 0) {
                // Nếu đang ở Hero cuối cùng, cho phép cuộn xuống phần nội dung dưới
                if (currentHeroIndex === totalHeroPages - 1) {
                    return; 
                } else {
                    e.preventDefault(); 
                    scrollToPage('next');
                }
            } 
            // Cuộn lên
            else { // e.deltaY < 0
                // Nếu đang ở Hero đầu tiên, không làm gì
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