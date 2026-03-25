import { divider, mutedText, pageWrapper } from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* Visual separation from the main content */}
      <div className={pageWrapper}>
        <hr className={divider} />
        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-sm font-semibold text-[#1d1d1f]">Footer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;