import { cn } from "@/lib/utils";
import { Armchair, Disc, Bath } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SeatPickerProps {
  onSelect: (seat: string) => void;
  selectedSeat: string | null;
  busClass: string;
  onChangeClass: (c: string) => void;
}

export default function SeatPicker({ onSelect, selectedSeat, busClass, onChangeClass }: SeatPickerProps) {
  // Determine rows based on busClass
  // Standar: 52 seats (13 rows of 4)
  // VIP: 44 seats (11 rows of 4)
  // Executive: 32 seats (8 rows of 4)
  
  const getClassRows = () => {
    switch(busClass) {
      case "VIP": return 11;
      case "Executive": return 8;
      default: return 13; // Standar
    }
  };

  const rows = getClassRows();
  const columns = ["A", "B", "C", "D"];
  const occupiedSeats: string[] = [];

  return (
    <div className="bg-light p-4 sm:p-8 rounded-3xl border border-dark/5">
      <div className="flex justify-center gap-1.5 sm:gap-4 mb-6 sm:mb-8">
        {["Standar", "Executive", "VIP"].map((c) => (
          <button
            key={c}
            onClick={() => { onChangeClass(c); onSelect(""); }}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
              busClass === c 
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                : "bg-white text-dark/40 border border-dark/5 hover:border-primary/50 hover:text-primary"
            }`}
          >
            Kelas {c === "Executive" ? "Eksekutif" : c}
            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full hidden md:inline-block ${busClass === c ? "bg-white/20 text-white" : "bg-dark/5 text-dark/40"}`}>
              {c === "Standar" ? "52 Kursi" : c === "Executive" ? "32 Kursi" : "44 Kursi"}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-6 sm:mb-8 flex flex-col items-center">
        <div className="w-full max-w-[280px] sm:max-w-xs flex justify-between items-center mb-2 px-2">
          <span className="text-[10px] font-extrabold text-dark/40 uppercase tracking-widest">Depan Bus</span>
          <div className="flex items-center gap-2 bg-dark/10 px-3 py-1 rounded-full text-dark/60">
            <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Area Supir</span>
          </div>
        </div>
        <div className="w-full max-w-[280px] sm:max-w-xs h-2 bg-dark/20 rounded-t-lg" />
      </div>

      {/* Driver Seats Row (Positioned on the RIGHT side - RHD Indonesian Bus) */}
      <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mb-6 p-2.5 bg-dark/5 rounded-2xl border border-dashed border-dark/10 flex justify-between items-center">
        {/* Left Side: Door / Entrance Label */}
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-dark/50 uppercase tracking-wider pl-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Pintu Masuk
        </div>

        {/* Right Side: Driver Seats (Supir 2 & Supir 1 / Kemudi on the far right) */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-dark/40 uppercase tracking-wider hidden sm:inline-block mr-1">Area Supir</span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dark/15 text-dark/60 flex flex-col items-center justify-center font-bold text-[9px]" title="Supir Cadangan">
            <Armchair className="w-4 h-4 mb-0.5" />
            Supir 2
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-white flex flex-col items-center justify-center font-bold text-[9px] shadow-sm ring-2 ring-primary/30" title="Kemudi Supir Utama">
            <Disc className="w-4 h-4 mb-0.5 animate-spin" style={{ animationDuration: '8s' }} />
            Supir 1
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative min-h-[360px] pb-2">
        <AnimatePresence mode="wait">
          <motion.div 
            key={busClass}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-[280px] sm:max-w-xs mx-auto space-y-2 sm:space-y-4"
          >
            {/* Regular passenger rows */}
            {Array.from({ length: rows - 1 }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-2 sm:gap-4">
                {columns.map((col, colIndex) => {
                  const seatId = `${rowIndex + 1}${col}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeat === seatId;

                  return (
                    <div key={seatId} className={cn(
                      "flex flex-col items-center",
                      colIndex === 1 && "mr-3 sm:mr-8" // Aisle
                    )}>
                      <motion.button
                        type="button"
                        whileHover={{ scale: isOccupied ? 1 : 1.1 }}
                        whileTap={{ scale: isOccupied ? 1 : 0.95 }}
                        disabled={isOccupied}
                        onClick={() => onSelect(seatId)}
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all relative group",
                          isOccupied ? "bg-dark/10 text-dark/20 cursor-not-allowed" :
                          isSelected ? "bg-primary text-white shadow-lg scale-105 sm:scale-110" :
                          "bg-white text-dark/40 hover:bg-primary/10 hover:text-primary border border-dark/5"
                        )}
                      >
                        <Armchair className="w-4 h-4 sm:w-6 sm:h-6" />
                        {!isOccupied && !isSelected && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            Seat {seatId}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Rear Toilet + Contiguous 4 Back Seats Row */}
            <div className="pt-4 border-t border-dashed border-dark/10 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl text-blue-600">
                  <Bath className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Toilet</span>
                </div>
              </div>

              {/* Row 4 Kursi Bergabung di Belakang */}
              <div className="p-2.5 bg-primary/5 rounded-2xl border border-primary/20">
                <p className="text-[9px] font-bold text-primary/70 uppercase tracking-widest text-center mb-2">Kursi Belakang</p>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {columns.map((col) => {
                    const seatId = `${rows}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <div key={seatId} className="flex flex-col items-center">
                        <motion.button
                          type="button"
                          whileHover={{ scale: isOccupied ? 1 : 1.1 }}
                          whileTap={{ scale: isOccupied ? 1 : 0.95 }}
                          disabled={isOccupied}
                          onClick={() => onSelect(seatId)}
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all relative group",
                            isOccupied ? "bg-dark/10 text-dark/20 cursor-not-allowed" :
                            isSelected ? "bg-primary text-white shadow-lg scale-105 sm:scale-110" :
                            "bg-white text-dark/40 hover:bg-primary/10 hover:text-primary border border-dark/5"
                          )}
                        >
                          <Armchair className="w-4 h-4 sm:w-6 sm:h-6" />
                          {!isOccupied && !isSelected && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              Seat {seatId}
                            </span>
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dark/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-dark/40">
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-white border border-dark/5" /> Tersedia
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-primary" /> Dipilih
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-dark/10" /> Terisi
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-blue-500/20 border border-blue-500/40" /> Toilet
        </div>
      </div>
    </div>
  );
}
