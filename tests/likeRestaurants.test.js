import FavoriteRestaurants from "../src/scripts/data/idb-favorite-restaurants";
import LikeButtonInitiator from "../src/scripts/utils/like-button-initiator";

describe("Liking A Restaurant", () => {
  const addLikeButtonContainer = () => {
    document.body.innerHTML = '<div id="likeContainer"></div>';
  };

  beforeEach(() => {
    addLikeButtonContainer();
  });

  it("should show the like button when the restaurant has not been liked before", async () => {
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeContainer"),
      restaurant: {
        id: 1,
      },
    });

    expect(
      document.querySelector('[aria-label="tambahkan ke favorit"]')
    ).toBeTruthy();
  });

  it("should be able to like the restaurant", async () => {
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeContainer"),
      restaurant: {
        id: 1,
      },
    });

    document.querySelector("#likeButton").dispatchEvent(new Event("click"));

    const restaurant = await FavoriteRestaurants.getRestaurants(1);
    expect(restaurant).toEqual({ id: 1 });
  });

  it("should not add a restaurant again when its already liked", async () => {
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeContainer"),
      restaurant: {
        id: 1,
      },
    });

    await FavoriteRestaurants.putRestaurants({ id: 1 });

    document.addEventListener("DOMContentLoaded", async () => {
      document.querySelector("#likeButton").dispatchEvent(new Event("click"));
    });

    expect(await FavoriteRestaurants.getAllRestaurants()).toEqual([{ id: 1 }]);

    await FavoriteRestaurants.deleteRestaurants(1);
  });
  it("should not add a restaurant when it has no id", async () => {
    await LikeButtonInitiator.init({
      likeButtonContainer: document.querySelector("#likeContainer"),
      restaurant: {},
    });

    document.querySelector("#likeButton").dispatchEvent(new Event("click"));

    expect(await FavoriteRestaurants.getAllRestaurants()).toEqual([]);
  });
});
