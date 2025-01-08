import { notFound } from 'next/navigation';
import { getCategories } from '@/utils/projectUtils';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categories = getCategories();
  const category = categories[params.slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {category.title}
      </h1>

      <div className="grid gap-6">
        {category.projects.map((project) => (
          <div 
            key={project.name}
            className="bg-card border border-border rounded-lg p-6 flex gap-6 items-start"
          >
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                <Image
                  src={project.image || '/placeholder.svg'}
                  alt={project.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-white mb-2">
                {project.name}
              </h2>
              
              {project.description && (
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {project.links?.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {new URL(link).hostname}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 