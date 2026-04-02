-- Seed data for Little Adrspach climbing guide
-- 8 walls, 46 routes

-- Walls (ordered right to left per guidebook)
INSERT INTO public.walls (id, name, slug, sort_order, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Alphabet Wall and the Great Chimney', 'alphabet-wall', 1, 'The first wall you encounter from the road entrance. Features a prominent chimney with several quality routes on both sides.'),
  ('11111111-0000-0000-0000-000000000002', 'Main Wall', 'main-wall', 2, 'The largest and most developed wall at Little Adrspach, featuring a variety of classic routes across its broad face.'),
  ('11111111-0000-0000-0000-000000000003', 'Water Wall', 'water-wall', 3, 'A shorter wall section near the stone bridge, featuring a few steep and challenging routes.'),
  ('11111111-0000-0000-0000-000000000004', 'Grotto', 'grotto', 4, 'A sheltered area featuring a prominent tower with quality routes on its overhanging face.'),
  ('11111111-0000-0000-0000-000000000005', 'Fortress Wall', 'fortress-wall', 5, 'A castle-like wall formation with a few excellent routes on its steep face.'),
  ('11111111-0000-0000-0000-000000000006', 'Left Cliff', 'left-cliff', 6, 'A large cliff section with many routes ranging from the waterfront tower to higher walls. Home to Namaste and many classics.'),
  ('11111111-0000-0000-0000-000000000007', 'Dead Crow Tower, Colosseum', 'dead-crow-tower', 7, 'A distinct tower and amphitheater-like area with mixed routes and a prominent dihedral.'),
  ('11111111-0000-0000-0000-000000000008', 'The Block', 'the-block', 8, 'The last climbing area, a detached block near the parking exit with a cave and several short routes.');

-- Routes: Alphabet Wall and the Great Chimney (1-8)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000001', '1', 'Warm Up', '5.8', '6b', 40, 'sport', 'FA, Aug 2000', 'Farthest right climb. Start up the slab. Cut right at the bulge/crux or go straight up the blank section at 5.10+/11-.', 1),
  ('11111111-0000-0000-0000-000000000001', '2.a', 'Fat Boys Dilema', '5.8', '6b?', 40, 'sport', 'FA, Aug 2000', 'Climb the off-width-flaring crack to the top of the pillar. Head right and up to bypass the roof.', 2),
  ('11111111-0000-0000-0000-000000000001', '2.b', 'Fat Boys Bulge', '5.9', '5b', 40, 'sport', 'FA, Aug 2000', 'Climb the off-width-flaring crack to the top of the pillar. Head up and left over the roof to the anchors.', 3),
  ('11111111-0000-0000-0000-000000000001', '3', 'The Stallion', '5.11a', '4b', 35, 'sport', 'TM, July 2000', 'A superb climb requiring intricate foot and body work. A very committing lead! Locate the climb on the right wall of the chimney, starting at the belay tree. Head left and up the blank wall avoiding the dirty crack to the right. From the small ledge head up and left following the line of bolts using small flakes to the anchors. The route does not make use of the arete!', 4),
  ('11111111-0000-0000-0000-000000000001', '4', 'Buddah', '5.11b', '7b', 35, 'sport', 'TM, Apr 2001', 'This is one of the harder climbs located on the left wall inside the chimney. Balance, strength and technique are required to get off the ground. Start at the base of the wall below the ramp. Climb the face to the first bolt avoiding the arete. Follow the crack leading right then straight up to the bolt at the top. Exit the climb to the left at the anchors.', 5),
  ('11111111-0000-0000-0000-000000000001', '5', 'The Arete', '5.10a', '5b', 35, 'sport', 'TM, Aug 2000', 'Start on the left outside edge of the chimney. After the first bolt head up-right through the overhang into the inside of the chimney. Layback the arete to the anchors.', 6),
  ('11111111-0000-0000-0000-000000000001', '6', 'Ribit', '5.8?', '5b?', 60, 'trad', 'TM, SW Apr 2001', 'A radically unique route with reasonably protected moves. Climb up the detached flake and then step onto the main cliff. Climb to the ledge and traverse right past 2 cracks and around a prominent corner. Pull up the left facing corner and two small roofs to the anchors at a small cedar.', 7),
  ('11111111-0000-0000-0000-000000000001', '7', 'Cedar Detour', '5.9', NULL, 55, 'trad', 'TM, MT Sep 2000', 'One of the few traditional routes on the cliff that follows the right crack left of the arete. An interesting powerful crux. Start as for Zoodles. Head right at the first ledge to the base of the two cracks. Take the right crack to the top. Traverse left to the anchors.', 8),
  ('11111111-0000-0000-0000-000000000001', '8', 'Fatboy''s Dirty Crack', '5.7', NULL, 55, 'trad', 'FA, SW Aug 2000', 'The first traditional climb on the Alphabet Wall. Scary, footwork dependent lead, a little dirty but worth the effort. Start as for Cedar Detour, take the left crack/corner to the top. Traverse left to the anchors.', 9);

-- Routes: Main Wall (9-17)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000002', '9', 'Zoodles', '5.9', '6b', 50, 'sport', 'TM, Aug 2000', 'This climb starts between the large flake and the main wall. An interesting climb with a balancy chess-move crux. Climb the flake to the bolt then move onto the face of the wall. Head left at the ledge to the bolt. Climb the lower angle wall following the line of bolts to the top.', 10),
  ('11111111-0000-0000-0000-000000000002', '10.a', 'Right of the Fish Flakes', '5.11b', '7b?', 50, 'sport', 'TM, Sep 2000', 'A very interesting route with a strenuous and balancy crux. This climb takes a direct line up starting at the undercling flake left of the previous climb. Climb on the right side of the seam, over the bulges to finger crack at the top.', 11),
  ('11111111-0000-0000-0000-000000000002', '10.b', 'The Fish Flakes', '5.10b', '7b?', 50, 'sport', 'TM, Sep 2000', 'A fabulous route that basically follows the same line as the previous route starting at the flake. Climb left of the seam using the fish flakes (Gills) holds, over the bulge rejoining the previous route.', 12),
  ('11111111-0000-0000-0000-000000000002', '11', 'Alphabet Soup', '5.10a-c', '8b', 50, 'sport', 'TM/MS, Sept 2000', 'Variation 1 (10a): Start on the undercling flake heading left following the line of bolts. Pull through the bulge to the right leaning crack. Negotiate the crack to the anchors. Variation 2 (10c): Start 8'' left of the undercling. Climb the face to the first (far) bolt. Follow a straight line to the top climbing left of the right leaning crack over a small bulge.', 13),
  ('11111111-0000-0000-0000-000000000002', '12', 'Steel-N-Socks', '5.9', '7b', 50, 'sport', 'MS Aug 2000', 'An excellent climb following a direct line up the cliff. Start about 15'' left of the flake at a small mossy ledge. Climb the face to a vertical crack, then past the crack to the anchors. Getting to the anchors is the crux.', 14),
  ('11111111-0000-0000-0000-000000000002', '13', 'Rooster In The Hole', '5.10b', '7b', 50, 'sport', 'TM, Aug 2000', 'A sustained and superb lead. A boulder sit start in the hole under the overhang just right of the arete begins the climb. Climb through the overhang onto the face climbing right of the arete. Mantle/undercling onto the second ledge then face climb to the anchors.', 15),
  ('11111111-0000-0000-0000-000000000002', '14', 'Hangover Overhang', '5.10d?', '6b?', 50, 'sport', 'TM/MS, May 2000', 'This awkward and strenuous climb begins about 5'' left of the arete. Climb up the face to the overhang. You will notice a nest on your right. Do not disturb the nest. Pull hard strenuous moves through the roof then climb seams and cracks to the top.', 16),
  ('11111111-0000-0000-0000-000000000002', '15', 'Franks be to Gord', '10b', '7b', 50, 'sport', 'DS, Aug 2023', 'Head up the face immediately left of the arete. Step off the ledge onto the bulge and angle up and left. Follow the left weakness to the top.', 17),
  ('11111111-0000-0000-0000-000000000002', '16', 'Arrow', '10c?', '8b?', NULL, 'sport', 'TM, Aug 2023', 'This route climbs the face just before the second prominent right facing corner past the overhangs. Techy climbing midway. The hidden arrow is very helpful if you can find it.', 18),
  ('11111111-0000-0000-0000-000000000002', '17', 'Beaver Feaver', '5.9', NULL, 50, 'sport', 'ME, Aug 2023', 'Last climb on main cliff, climb the face with a yellow tang. Strong sustained movement all the way up, with a pitstop in the middle.', 19);

-- Routes: Water Wall (18-20)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000003', '18', 'Zesty Doritos', '5.12a?', NULL, NULL, 'sport', 'SM Sept 2023', 'Last climb before the stone bridge. Manouver yourself up the fun face. Shake off and pull the killer roof! Find the Jugs!', 20),
  ('11111111-0000-0000-0000-000000000003', '19', 'Wet Again Yet Again', '5.10c?', NULL, NULL, 'sport', 'ME May 2024', 'Start from the bridge. Follow up the arete, exit out on the diagonal crack over the roof.', 21),
  ('11111111-0000-0000-0000-000000000003', '20', 'Beavis', '5.10a', '4b', 50, 'sport', 'B.U Sept 23 - formerly variation of HeMan rips - TR', 'Find the flow!', 22);

-- Routes: Grotto (21-24)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000004', '21.a', 'Sunny B Crack (Variation)', '5.10a', NULL, NULL, 'mixed', 'DS, June 2024', 'The beginning hard moves of Sunny B can be avoided by climbing on the right beside the tree for a few moves. Then move back left and take the crack to the anchors.', 23),
  ('11111111-0000-0000-0000-000000000004', '21.b', 'Sunny Be', '5.11b', '5b', 40, 'TR', 'DS, November 2023 / TM/MS, Jan 99', 'This climb takes a route up the center of the slightly overhanging main face of the tower. Awesome moves and a high quality route. Start on the right and immediately move left to gain right facing holds. Dance your way to the second bolt (Crux) continue straight up the face above the crack to the top anchors. Consider pre-hanging the 2nd draw.', 24),
  ('11111111-0000-0000-0000-000000000004', '22', 'Arette/left face at top', '5.10c?', NULL, NULL, 'sport', 'TM May 2024', 'Good holds on the left somewhere.', 25),
  ('11111111-0000-0000-0000-000000000004', '23', 'Dihedral corner', '5.7', NULL, NULL, 'trad', 'FA, 2024', NULL, 26),
  ('11111111-0000-0000-0000-000000000004', '24', 'Another Flake Bites the Dust', '5.7', NULL, NULL, 'trad', 'FA, 2024', NULL, 27);

-- Routes: Fortress Wall (25-27)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000005', '25', 'The Fortress', '5.9', '5b', 40, 'sport', 'DS, Sept 2023', 'Start down right at the crack. Head a little left then up through underclings to the mid cliff break. Pinch and sidepull your way up to the right side of the castle''s parapet.', 28),
  ('11111111-0000-0000-0000-000000000005', '26', 'Sticks of Sisyphus', '5.10a', '5b', 40, 'sport', 'DS, Nov 2023', 'Head straight up the left side of the castle wall.', 29),
  ('11111111-0000-0000-0000-000000000005', '27', 'Trundle Thunder', '5.8', NULL, NULL, 'sport', 'ME, BU Aug 2024', 'Bolt line right of The Crack, roll out onto the flake and step back over the gap to the head wall.', 30);

-- Routes: Left Cliff (28-38)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000006', '28', 'The Crack', NULL, NULL, NULL, 'trad', NULL, 'Wide, flaring crack that splits the wall.', 31),
  ('11111111-0000-0000-0000-000000000006', '29.a', 'The Flake', '5.10a', NULL, 45, 'TR', 'TM/MS, Jan 99', 'Follow the same bolt line as Turtle Back, however use the dirty flake. At the top, veer right or go straight for a long runout.', 32),
  ('11111111-0000-0000-0000-000000000006', '29.b', 'Turtle Back', '5.11b', NULL, 45, 'TR', 'TM/MS, Apr 2001', 'This route follows the seam just left of the flake and right of Namaste. Start on the flake for about 2 moves and move left towards the seam and a right leaning crack. Pull through the flat section (crux) to a good hold, following the crack towards the top. Face-climb the last 5 metres to the top.', 33),
  ('11111111-0000-0000-0000-000000000006', '30', 'Namaste', '5.11c', '6b', 45, 'sport', 'TM/MS, Apr 2000', 'The finest route in the universe. A hard and sustained lead. This route climbs the water overhanging face of the tower. Begin the climb by traversing left above the water to the start of the right leaning crack. Climb up the cracks and face following the line of bolts to the top.', 34),
  ('11111111-0000-0000-0000-000000000006', '31.a', 'Bridge to Babylon', '5.10a', NULL, 45, 'sport', NULL, 'Climb the arete just left of Namaste. Amazing moves, holds and exposure. Shares and anchor with Namaste.', 35),
  ('11111111-0000-0000-0000-000000000006', '31.b', '5.9 to Babylon Link up', '5.9/10a', NULL, NULL, 'sport', 'DS? 2024', 'Climb the first two bolts of the 5.9, then traverse right to the 3rd(?) bolt of Babylon and continue up it.', 36),
  ('11111111-0000-0000-0000-000000000006', '32', 'Daddy Long Legs', '5.9', NULL, NULL, 'sport', NULL, 'First climb before the bridge. Belay from shore. Fantastic climbing.', 37),
  ('11111111-0000-0000-0000-000000000006', '33', 'Rat Trap', '5.10a', NULL, NULL, 'sport', 'unknown fa. recleaned 2024 BU', 'Old foot trap at base.', 38),
  ('11111111-0000-0000-0000-000000000006', '34', 'Sunken Treasure', '5.10b', NULL, NULL, 'sport', 'Unknown FA. recleaned May 2024 LS', NULL, 39),
  ('11111111-0000-0000-0000-000000000006', '35', 'Bad Crystal Mojo', '5.10c', NULL, NULL, 'sport', 'TM 2024', NULL, 40),
  ('11111111-0000-0000-0000-000000000006', '36', 'The Black Widow', '5.11?', '4b?', NULL, 'sport', NULL, 'Share first bolt with Bad Crystal Mojo. Then begin left traverse.', 41),
  ('11111111-0000-0000-0000-000000000006', '37', 'Techno Viking', '5.10c?', '4b', NULL, 'sport', 'Unknown FA. Cleaned Oct 2023 B.U', 'Start heading left or right. Continue up the fun moves throughout.', 42),
  ('11111111-0000-0000-0000-000000000006', '38', 'Unknown', NULL, NULL, NULL, 'sport', NULL, '3 bolts then traverse left to the great dihedral to finish.', 43);

-- Routes: Dead Crow Tower, Colosseum (39-42)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000007', '39', 'The Great Dihedral', '5.10b', '3b', 65, 'mixed', NULL, 'Climbs the prominent right facing dihedral crack and finishes on the face to a bolted anchor.', 44),
  ('11111111-0000-0000-0000-000000000007', '40', 'Unknown on roof/bulge', '5.12a', NULL, NULL, 'sport', NULL, NULL, 45),
  ('11111111-0000-0000-0000-000000000007', '41', 'Choral Jug', '10.abc?', NULL, NULL, 'sport', NULL, 'Left climb on the bulge. Pull through some fun moves and navigate the choss at the top. Webbing anchor on the tree above. *no anchor?*', 46),
  ('11111111-0000-0000-0000-000000000007', '42', 'Termites', '5.10b', NULL, NULL, 'sport', 'unknown fa. recleaned 2023 BU, LS', 'For sure it''s a 5.6. It''s not. Fun climb with some puzzles to sort out.', 47);

-- Routes: The Block (43-46)
INSERT INTO public.routes (wall_id, number, name, grade_yds, grade_french, height_ft, protection, first_ascent, description, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000008', '43', 'Frank''s Old Crack', '5.7', NULL, NULL, 'trad', NULL, 'Amazing jams after a steep wider start. On the left just as you exit the cave. Tree anchor above.', 48),
  ('11111111-0000-0000-0000-000000000008', '44', 'Huey', '5.8', '3b', NULL, 'sport', 'unknown fa. recleaned 2024 BU', 'Enjoyable with good holds.', 49),
  ('11111111-0000-0000-0000-000000000008', '45', 'Dewey', '5.10b', '2b', NULL, 'sport', 'unknown fa. recleaned 2024 BU', 'Spice is life up to the anchor.', 50),
  ('11111111-0000-0000-0000-000000000008', '46', 'Louie', '5.9', '3b', NULL, 'sport', 'unknown fa. recleaned 2024 BU', 'Some fun unique holds.', 51);
