import { getPokemonFullDetails } from '@/app/api/pokemonService';
import cardStyles from '@/app/components/Card/Card.module.css';
import styles from '@/app/components/PokemonDetailView/PokemonDetailView.module.css';
import Image from 'next/image';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

type PokemonDetailPageProps = {
  params: {
    pokemonId: string;
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }: PokemonDetailPageProps) {
  try {
    const pokemon = await getPokemonFullDetails(params.pokemonId);
    return {
      title: `Pokedex: ${pokemon.name}`,
      description: pokemon.description,
    };
  } catch (error) {
    return {
      title: 'Pokemon Not Found',
    };
  }
}

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const t = await getTranslations('DetailsPage');

  try {
    const pokemon = await getPokemonFullDetails(params.pokemonId);
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" className="button-link" style={{ marginBottom: '2rem' }}>
          {t('backToList')}
        </Link>
        <aside className={styles.detailsView} role="complementary">
          <div className={styles.content}>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={pokemon.name}
                className={styles.image}
                width={400}
                height={400}
                priority
              />
            )}
            <h2 className={styles.name}>
              {pokemon.name}
              <span className={styles.id}>
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </h2>
            <div className={styles.types}>
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className={`${cardStyles.type} ${cardStyles[type.name]}`}
                >
                  {type.name}
                </span>
              ))}
            </div>
            <p className={styles.description}>{pokemon.description}</p>
            <div className={styles.statsContainer}>
              <h3>Base Stats</h3>
              <ul>
                {pokemon.stats.map(({ stat, base_stat }) => (
                  <li key={stat.name} className={styles.statItem}>
                    <span className={styles.statName}>{stat.name}</span>
                    <span className={styles.statValue}>{base_stat}</span>
                    <div className={styles.statBar}>
                      <div
                        className={styles.statBarFill}
                        style={{ width: `${(base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Pokemon not found</h1>
        <p>Could not find the requested Pokemon.</p>
        <Link href="/">Go back to the list</Link>
      </div>
    );
  }
}
