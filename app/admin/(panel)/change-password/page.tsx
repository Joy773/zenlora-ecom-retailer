import ChangePassword from "@/components/change-password";

export default function AdminChangePasswordPage() {
  return (
    <section className="px-8 py-10 md:px-12 lg:px-16">
      <h1 className="font-serif text-4xl font-normal italic text-foreground md:text-5xl">
        Change password
      </h1>
      <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-foreground/60">
        Update your admin account password.
      </p>
      <ChangePassword />
    </section>
  );
}
