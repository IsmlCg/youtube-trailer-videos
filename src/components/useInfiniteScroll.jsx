import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback) => {
    const observer = useRef();
    
    useEffect(() => {
        const element = observer.current;
        if (element) {
            const observerInstance = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    callback();
                }
            }, {
                rootMargin: '100px',
            });
            observerInstance.observe(element);
            return () => observerInstance.unobserve(element);
        }
    }, [callback]);
    
    return observer;
};

export default useInfiniteScroll;
