<?php
/*
 * Name:  foto-album-archief
 * Title: Foto album archief
 * Description: Show foto albums met filters
 * Category: ffg-blocks
 * Icon: ws-icon-list
 * Keywords: foto albums, foto mappen
 * Post Types: post, page, product
 * 
 * 
 * Deze file haalt de data uit de WP-database en retuned uiteindelijk een JSON naar foto-data.json 
 *
 */

/**
 * Hero block template. s
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Set name of the block for class and ID generation (Optional in this case)
$name = 'foto-albums';

?>

<!DOCTYPE html>
<html lang="NL">

<head>
  <meta charset="UTF-8">
  <title>Foto Album Archief</title>

  <?php

  $args = array(
    'post_type' => 'foto_albums',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  );

  $the_query = new WP_Query($args);

  if (!$the_query->have_posts()) {
    echo esc_html__('Geen foto-albums gevonden');
    return;
  }

  while ($the_query->have_posts()) {
    $the_query->the_post();

    $post_id = get_the_ID();
    $title = get_the_title();
    $permalink = get_the_permalink();
    $albumcover = get_field('album_hoes_foto', $post_id);
    $location = get_field('locatie-event', $post_id);
    $year = get_field('jaar', $post_id);
    $category = get_field('categorie_foto_album', $post_id);

    if (is_array($location) && isset($location[0]['value'])) {
      $location_value = $location[0]['value'];
    } else {
      $location_value = null; // Default value if not set
    }

    $album_data = array(
      'id' => $post_id,
      'title' => $title,
      'permalink' => $permalink,
      'albumhoesfoto' => $albumcover,
      'locatie-event' => $location_value,
      'year' => $year,
      'category' => $category
    );
    $albums[] = $album_data;
    // var_dump ($albums);
  }

  wp_reset_postdata();

  $json_data = json_encode($albums);

  // Write the JSON data to a file
  $file_path = __DIR__ . '/foto-data.json';

  if (file_put_contents($file_path, $json_data) !== false) {
    // echo 'Foto data written to ' . $file_path;
  } else {
    //  echo 'Error writing foto data to file!';
  }

  ?>

</head>

<body>

  <section class="news">
    <div class="container">
      <div class="news__header">
        <a href="link-to" style="text-decoration: none;">
          <div class="backtoprevious">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25"
              style="transform: scaleX(-1);">
              <rect width="100%" height="100%" fill="#f2920000" />
              <path fill="#2d3271"
                d="M17.5 12.999l-0.707 0.707 5.293 5.293H1v1h21.086l-5.294 5.295 0.707 0.707L24 19.499l-6.5-6.5z"
                data-name="Right" />
            </svg>
            <?php
            $referer_url = wp_get_referer();
            ?>
            <a href="<?php echo esc_url($referer_url); ?>"><?php _e( 'Terug naar de vorige pagina', TEXTDOMAIN ); ?></a>
          </div>
        </a>

        <div class="news__titel">
          <h1><?php the_title(); ?></h1>
        </div>

        <form id="filter-form">
          <select id="locatie" name="locatie" class="dropdownFotoAlbum">
            <option value=""> </option>
          </select>

          <select id="jaar" name="jaar" class="dropdownFotoAlbum">
            <option value=""> </option>
          </select>

          <select id="categorie" name="categorie" class="dropdownFotoAlbum">
            <option value=""> </option>
          </select>

          <input type="submit" id="filter-submit" value="Filteren" class="btn btn-small btn--orange">
        </form>
      </div>
    </div>
  </section>
 


  <div id="filter-results">
  </div>


  <script type="text/javascript">
    var albums = <?php echo $json_data; ?>;
  </script>

  <script src="<?php echo get_template_directory_uri(); ?>/src/scripts/foto-album-archief.js"></script>
</body>

</html>