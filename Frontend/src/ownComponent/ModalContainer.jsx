export function ModalContainer({ isOpen, children }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-auto">
          {children}
        </div>
      </div>
    )
  }
  
  