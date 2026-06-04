{isVideoOpen && (
        <div className="fixed inset-0 z-[5000] bg-black">
          <iframe
            data-cursor="[ CLOSE ]"
            src="https://www.youtube.com/embed/shT8Ccb1YHI?autoplay=1&mute=1&playsinline=1&rel=0"
            title="Local Project Video"
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
