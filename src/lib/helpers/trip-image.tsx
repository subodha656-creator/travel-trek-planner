import Image from "next/image";

type SupabasePublicImageProps = {
  path: string;
  alt?: string;
  className?: string;
};

const SupabasePublicImage = ({
  path,
  alt = "Image",
  className = "rounded-lg w-full",
}: SupabasePublicImageProps) => {
  const PROJECT_REF = process.env.NEXT_PUBLIC_PROJECT_ID;
  const BUCKET = "travelplanner"; // ⬅️ replace with your actual bucket name

  const imageUrl = `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/${path}`;
    if(!path){
        return <Image width={100} height={100} src="/images/no-image.png" alt={alt} className={className} />
    }
  return <Image width={100} height={100} src={imageUrl} alt={alt} className={className} />;
};

export default SupabasePublicImage;
