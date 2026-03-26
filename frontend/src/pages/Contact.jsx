import ContactForm from "../components/Contact/Form";
import { useLanguage } from "../components/LanguageContext";
import AnimatedText from "../components/MotionAnimation/AnimatedText";

function Contact() {
  const { t } = useLanguage();

  return (
    <section className="my-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-10 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.contact.opinion}
        </h2>
        <p className="mx-7 my-8 text-sm font-normal sm:text-base md:mx-4 md:text-lg lg:mx-0">
          <AnimatedText text={t.contact.description} />
        </p>
      </div>

      <ContactForm />
    </section>
  );
}

export default Contact;
