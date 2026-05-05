"""Seed the database with sample data for development."""

import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from booklyApp.models import Author, Genre, Book, Review, Comment, Like, Favorite, Profile


GENRES = [
    ("Fantasy", "Magical worlds and extraordinary adventures"),
    ("Science Fiction", "Futuristic and speculative stories"),
    ("Mystery", "Crime, detective, and suspense stories"),
    ("Romance", "Love stories and relationships"),
    ("Horror", "Scary and supernatural tales"),
    ("Non-Fiction", "Real-world facts and stories"),
    ("Historical Fiction", "Stories set in the past"),
    ("Thriller", "Fast-paced, suspenseful narratives"),
]

AUTHORS = [
    ("J.R.R. Tolkien", "1892-01-03", "British"),
    ("George Orwell", "1903-06-25", "British"),
    ("Gabriel García Márquez", "1927-03-06", "Colombian"),
    ("Haruki Murakami", "1949-01-12", "Japanese"),
    ("Margaret Atwood", "1939-11-18", "Canadian"),
    ("Isaac Asimov", "1920-01-02", "American"),
    ("Agatha Christie", "1890-09-15", "British"),
    ("Stephen King", "1947-09-21", "American"),
]

BOOKS = [
    ("The Lord of the Rings", 0, [0], 1954, "An epic high-fantasy novel about the quest to destroy the One Ring."),
    ("The Hobbit", 0, [0], 1937, "A fantasy novel about the adventure of Bilbo Baggins."),
    ("1984", 1, [1], 1949, "A dystopian novel set in a totalitarian society under constant surveillance."),
    ("One Hundred Years of Solitude", 2, [0, 6], 1967, "The multi-generational story of the Buendía family."),
    ("Norwegian Wood", 3, [3], 1987, "A nostalgic story of loss and sexuality in 1960s Japan."),
    ("The Handmaid's Tale", 4, [1, 7], 1985, "A dystopian novel about a totalitarian society that subjugates women."),
    ("Foundation", 5, [1], 1951, "A science fiction saga about the fall and rise of galactic civilizations."),
    ("Murder on the Orient Express", 6, [2, 7], 1934, "Hercule Poirot investigates a murder aboard a luxury train."),
    ("The Shining", 7, [4, 7], 1977, "A family's terrifying stay at an isolated hotel with a dark history."),
    ("Kafka on the Shore", 3, [0, 2], 2002, "Two intertwining stories of a teenage runaway and an elderly man."),
    ("Animal Farm", 1, [5, 6], 1945, "An allegorical novella about a group of farm animals rebelling against their human farmer."),
    ("Love in the Time of Cholera", 2, [3, 6], 1985, "A love story spanning over fifty years in a Caribbean city."),
]

REVIEW_CONTENTS = [
    "An absolute masterpiece. The world-building is incredible and the characters feel alive.",
    "I couldn't put this book down! The plot twists kept me on the edge of my seat.",
    "A thought-provoking read that stays with you long after you finish the last page.",
    "Beautiful prose and deeply moving. One of the best books I've ever read.",
    "Interesting premise but the pacing felt off in the middle sections.",
    "A classic for a reason. Every reader should experience this at least once.",
    "The character development is outstanding. You really feel connected to the protagonist.",
    "A bit slow to start but the payoff is absolutely worth it.",
    "Brilliantly written with layers of meaning that reward re-reading.",
    "Not my usual genre but I was pleasantly surprised. Highly recommended!",
    "The atmosphere this author creates is unmatched. Truly immersive storytelling.",
    "A quick and enjoyable read. Perfect for a weekend getaway.",
]

COMMENT_CONTENTS = [
    "I completely agree with this review!",
    "Interesting perspective, I hadn't thought of it that way.",
    "Great review! You captured exactly what I felt about this book.",
    "I respectfully disagree — I thought the ending was the best part.",
    "Thanks for the recommendation, adding this to my reading list!",
    "Well-written review. Have you read the sequel?",
]


class Command(BaseCommand):
    help = "Seed the database with sample books, reviews, and users"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # Create genres
        genres = []
        for name, desc in GENRES:
            genre, _ = Genre.objects.get_or_create(name=name, defaults={"description": desc})
            genres.append(genre)
        self.stdout.write(f"  Created {len(genres)} genres")

        # Create authors
        authors = []
        for name, birth, nationality in AUTHORS:
            author, _ = Author.objects.get_or_create(
                name=name, defaults={"birth_date": birth, "nationality": nationality}
            )
            authors.append(author)
        self.stdout.write(f"  Created {len(authors)} authors")

        # Create books
        books = []
        for title, author_idx, genre_idxs, year, synopsis in BOOKS:
            book, created = Book.objects.get_or_create(
                title=title,
                defaults={
                    "author": authors[author_idx],
                    "published_year": year,
                    "synopsis": synopsis,
                },
            )
            if created:
                book.genres.set([genres[i] for i in genre_idxs])
            books.append(book)
        self.stdout.write(f"  Created {len(books)} books")

        # Create users
        users = []
        usernames = ["alice", "bob", "carlos", "diana", "elena"]
        for username in usernames:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": f"{username}@bookly.dev"},
            )
            if created:
                user.set_password("password123")
                user.save()
                Profile.objects.get_or_create(user=user)
            users.append(user)
        self.stdout.write(f"  Created {len(users)} users")

        # Create reviews
        reviews = []
        for book in books:
            num_reviews = random.randint(1, 3)
            reviewers = random.sample(users, min(num_reviews, len(users)))
            for user in reviewers:
                review, created = Review.objects.get_or_create(
                    user=user,
                    book=book,
                    defaults={
                        "content": random.choice(REVIEW_CONTENTS),
                        "rating": random.randint(3, 5),
                    },
                )
                reviews.append(review)
        self.stdout.write(f"  Created {len(reviews)} reviews")

        # Create likes
        likes_count = 0
        for review in reviews:
            likers = random.sample(users, random.randint(0, len(users)))
            for user in likers:
                _, created = Like.objects.get_or_create(user=user, review=review)
                if created:
                    likes_count += 1
        self.stdout.write(f"  Created {likes_count} likes")

        # Create comments
        comments_count = 0
        for review in random.sample(reviews, min(len(reviews), 15)):
            num_comments = random.randint(1, 3)
            commenters = random.sample(users, min(num_comments, len(users)))
            for user in commenters:
                Comment.objects.get_or_create(
                    user=user,
                    review=review,
                    defaults={"content": random.choice(COMMENT_CONTENTS)},
                )
                comments_count += 1
        self.stdout.write(f"  Created {comments_count} comments")

        # Create some favorites
        fav_count = 0
        for user in users:
            fav_reviews = random.sample(reviews, random.randint(1, 5))
            for review in fav_reviews:
                _, created = Favorite.objects.get_or_create(user=user, review=review)
                if created:
                    fav_count += 1
        self.stdout.write(f"  Created {fav_count} favorites")

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
