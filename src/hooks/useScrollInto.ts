import { Ref, useEffect, useRef } from "react";

const useScrollInto = (): Ref<HTMLDivElement> =>  {
    const view = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (view.current)
            view.current.scrollIntoView({behavior: 'smooth'});
    })

    return (view);
}

export default useScrollInto;