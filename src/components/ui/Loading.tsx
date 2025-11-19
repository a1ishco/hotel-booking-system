import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/lottie/loadingLottie.json';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <img src="https://globalsoft.az/frontend/img/logo/favicon.png" alt="GlobalSoft Logo" className="w-20 h-20" />
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 300, height: 300 }}
                />
            </div>
        </div>
    );
}

